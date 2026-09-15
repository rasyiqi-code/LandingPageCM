import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cache memori untuk menyimpan hasil deteksi geolokasi IP klien guna menghindari pemanggilan API eksternal berulang kali
const ipCache = new Map<string, { countryCode: string; expiry: number }>();
const CACHE_TTL = 3600 * 1000; // Cache berlaku selama 1 jam
const MAX_CACHE_SIZE = 1000; // Batas ukuran cache untuk mencegah pemborosan memori RAM (memory leak)

export default async function proxy(request: NextRequest) {
    const hostname = request.headers.get("host") || "";

    // 0. Validasi host untuk local development (mencegah akses subdomain tidak sah di lokal)
    const isLocal = hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("[::1]");
    if (isLocal) {
        const cleanHost = hostname.replace(/:\d+$/, ""); // Hapus port
        if (cleanHost !== "localhost" && cleanHost !== "127.0.0.1" && cleanHost !== "[::1]") {
            return new NextResponse("Not Found", { status: 404 });
        }
    }

    const pathname = request.nextUrl.pathname;

    // 1. Identify Locale and Clean Path
    const locales = ['en', 'id'];
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    let locale = 'en'; // Default fallback
    let cleanPathname = pathname;

    if (pathnameHasLocale) {
        const pathLocale = pathname.split('/')[1];
        if (locales.includes(pathLocale)) {
            locale = pathLocale;
            cleanPathname = pathname.replace(`/${locale}`, '') || '/';
        }
    }

    // 2. Auth Check (Dashboard) - Check on CLEAN pathname to cover /id/dashboard etc.
    if (cleanPathname.startsWith("/dashboard")) {
        // Auth dihapus untuk mode website pemasaran statis
        return new NextResponse("Not Found", { status: 404 });
    }

    // 3. Detect preference if path has no locale prefix
    if (!pathnameHasLocale) {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        const acceptLanguage = request.headers.get('accept-language');
        let geoCountry = (request as NextRequest & { geo?: { country?: string } }).geo?.country || request.headers.get('x-vercel-ip-country');

        const isDev = process.env.NODE_ENV === 'development';
        const isLocalhost = request.headers.get('host')?.includes('localhost');

        // Fallback ke IP-API jika informasi geo tidak ada (untuk lingkungan non-Vercel)
        if (!geoCountry && !isDev && !isLocalhost) {
            try {
                const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || (request as NextRequest & { ip?: string }).ip;
                if (ip && ip !== '127.0.0.1' && ip !== '::1') {
                    const cachedGeo = ipCache.get(ip);
                    if (cachedGeo && cachedGeo.expiry > Date.now()) {
                        geoCountry = cachedGeo.countryCode;
                    } else {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 500);

                        try {
                            const ipRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
                                signal: controller.signal
                            });

                            if (ipRes.ok) {
                                const data = await ipRes.json();
                                if (data.countryCode) {
                                    const code: string = data.countryCode;
                                    geoCountry = code;
                                    if (ipCache.size >= MAX_CACHE_SIZE) {
                                        const now = Date.now();
                                        for (const [key, val] of ipCache.entries()) {
                                            if (val.expiry <= now) {
                                                ipCache.delete(key);
                                            }
                                        }

                                        if (ipCache.size >= MAX_CACHE_SIZE) {
                                            const oldestKey = ipCache.keys().next().value;
                                            if (oldestKey !== undefined) {
                                                ipCache.delete(oldestKey);
                                            }
                                        }
                                    }
                                    ipCache.set(ip, {
                                        countryCode: code,
                                        expiry: Date.now() + CACHE_TTL
                                    });
                                }
                            }
                        } finally {
                            clearTimeout(timeoutId);
                        }
                    }
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    console.warn('[Middleware] IP-API request timed out (500ms)');
                } else {
                    console.error('[Middleware] IP-API error:', err instanceof Error ? err.message : String(err));
                }
            }
        }

        // Determine locale from preferences
        if (cookieLocale && locales.includes(cookieLocale)) {
            locale = cookieLocale;
        } else if (acceptLanguage) {
            const browserLocale = acceptLanguage
                .split(',')
                .map(lang => lang.split(';')[0].trim().slice(0, 2).toLowerCase())
                .find(lang => locales.includes(lang));
            if (browserLocale) {
                locale = browserLocale;
            } else if (geoCountry === 'ID') {
                locale = 'id';
            }
        } else if (geoCountry === 'ID') {
            locale = 'id';
        }
    }

    // 4. Set locale header & cookie, then rewrite to clean path (tanpa redirect)
    const rewriteUrl = new URL(cleanPathname, request.nextUrl.origin);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-next-intl-locale', locale);
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });

    return response;
}

export const config = {
    matcher: ['/((?!api|admin|static|.*\\..*|_next|handler|genkit|test|feed|rss).*)']
};
