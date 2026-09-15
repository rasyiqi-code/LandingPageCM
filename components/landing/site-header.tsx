import Link from "next/link";
import { CtaChatButton } from "./cta-chat-button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Rocket, ChevronDown } from "lucide-react";

import { getTranslations, getLocale } from "next-intl/server";

import { getSystemSettings } from "@/lib/server/settings";
import { LogoImage } from "./logo-image";

export async function SiteHeader() {
    const t = await getTranslations("Navigation");
    const locale = await getLocale();

    // Blog URL Logic
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    let blogHostname = "";
    try {
        if (appUrl) {
            const url = new URL(appUrl);
            blogHostname = url.hostname.replace(/^www\./, '');
        }
    } catch {
        // console.error("Invalid APP_URL", e);
    }

    // Fallback if env var is missing or invalid (optional, but good for safety)
    if (!blogHostname) {
        // We can't easily guess the domain on server side without headers(), 
        // but for now let's leave it blank or rely on the fact that APP_URL should be set.
        // Or if we really want a default, make it a generic placeholder or keep it empty to hide the link?
        // Let's assume APP_URL is set as per standard setup.
    }

    const blogUrl = `http://blog.${blogHostname}`;

    // Fetch Logo & Brand & Phone
    // ⚡ Bolt: Use cached getSystemSettings instead of direct DB query
    const settings = await getSystemSettings(["AGENCY_LOGO", "AGENCY_NAME", "AGENCY_LOGO_DISPLAY", "CONTACT_PHONE"]);
    const logoUrl = settings.find(s => s.key === "AGENCY_LOGO")?.value;
    const agencyName = settings.find(s => s.key === "AGENCY_NAME")?.value || "Crediblemark";
    const displayMode = settings.find(s => s.key === "AGENCY_LOGO_DISPLAY")?.value || "both"; // 'both', 'logo', 'text'


    // Actually, "Text Only" usually implies just the text name.
    // "Logo Only" implies just the image.
    // "Both" implies Image + Text.
    // If no Image exists, we show Fallback Icon + Text usually.
    // Let's refine:

    // RENDER LOGIC:
    // Image/Icon component:
    // IF (ShowLogo AND logoUrl) -> Render Image
    // ELSE IF (mode != 'text') -> Render Icon (Fallback)

    // Text component:
    // IF (ShowText) -> Render Text

    return (
        <>
            <header className="no-print relative md:fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a] transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href={`/${locale}`} aria-label={agencyName} className="flex items-center gap-2 group cursor-pointer">
                            {/* Logo / Icon Section */}
                            {displayMode !== 'text' && (
                                <LogoImage
                                    src={logoUrl || "/logo.webp"}
                                    alt={`${agencyName} Logo`}
                                    width={120}
                                    height={32}
                                    className="h-8 w-auto object-contain hover:scale-105 transition-transform"
                                    priority
                                />
                            )}

                            {/* Text Section */}
                            {(displayMode === 'text' || displayMode === 'both') && (
                                <span className="font-bold text-lg tracking-tight text-white hidden sm:block group-hover:text-zinc-200 transition-colors">
                                    {agencyName}
                                </span>
                            )}
                        </Link>
                        <nav className="hidden md:flex items-center gap-3 lg:gap-6">
                            {/* Dropdown Solusi */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-xs lg:text-sm font-bold text-sky-500 hover:text-sky-400 transition-colors duration-200 cursor-pointer whitespace-nowrap bg-transparent border-0 py-2">
                                    {t("solutions")}
                                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                                </button>
                                <div className="absolute left-0 mt-1 w-64 rounded-2xl bg-[#0a0a0a] border border-white/10 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-0.5">
                                    <Link href={`/${locale}/wordpress`} className="block px-4 py-2 text-xs font-bold text-violet-400 hover:text-violet-300 hover:bg-white/5 rounded-xl transition-all">
                                        {t("wordpress")}
                                    </Link>
                                    <Link href={`/${locale}/web-repair`} className="block px-4 py-2 text-xs font-bold text-amber-500 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">
                                        {t("webRepair")}
                                    </Link>
                                </div>
                            </div>
                            <Link href="/promosi" className="text-xs lg:text-sm font-bold text-brand-yellow hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                {t("promo")}
                            </Link>
                            <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="text-xs lg:text-sm font-bold text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                {t("insight")}
                            </a>
                            <Link href={`/${locale}/portfolio`} className="text-xs lg:text-sm font-bold text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                Portfolio
                            </Link>
                        </nav>

                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        {/* Switcher Bahasa - tampil di semua ukuran layar */}
                        <div className="flex items-center gap-0.5 md:mr-2 md:border-r md:border-white/5 md:pr-4">
                            <LanguageSwitcher />
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Tombol Konsultasi Gratis (Utama) */}
                            <CtaChatButton 
                                className="h-8 sm:h-9 text-xs md:text-sm bg-brand-yellow hover:bg-brand-yellow/90 text-black font-extrabold cursor-pointer rounded-full px-3 sm:px-5 shadow-lg shadow-brand-yellow/10 transition-all hover:scale-105 active:scale-95 border-0" 
                                ariaLabel={t("consultation")}
                            >
                                <Rocket className="w-3.5 h-3.5 sm:hidden" />
                                <span className="hidden sm:inline">{t("consultation")}</span>
                            </CtaChatButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sub-Header Navigation - Sticky */}
            <div className="sticky top-0 z-40 md:hidden border-b border-white/5 bg-[#0a0a0a] overflow-x-auto no-scrollbar mask-gradient-x">
                <div className="flex items-center gap-6 px-6 h-10 w-max mx-auto min-w-full">
                    <Link href={`/${locale}/wordpress`} className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                        {t("wordpress")}
                    </Link>
                    <Link href={`/${locale}/web-repair`} className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                        {t("webRepair")}
                    </Link>
                    <Link href="/promosi" className="text-sm font-bold text-brand-yellow hover:text-brand-yellow/80 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                        {t("promo")}
                    </Link>
                    <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
                        {t("insight")}
                    </a>
                    <Link href={`/${locale}/portfolio`} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
                        Portfolio
                    </Link>
                </div>
            </div>
        </>
    );
}
