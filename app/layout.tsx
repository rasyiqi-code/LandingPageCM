import type { Metadata } from "next";
import { Inter } from "next/font/google";
import nextDynamic from "next/dynamic";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import { getSystemSettings } from "@/lib/server/settings";
import { cn } from "@/lib/shared/utils";
import { ScrollRestorer } from "@/components/ui/scroll-restorer";
import { GlobalLoader } from "@/components/providers/global-loader";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});



export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getLocale();
    const settings = await getSystemSettings(["AGENCY_NAME", "SEO_TITLE", "SEO_TITLE_ID", "SEO_DESCRIPTION", "SEO_DESCRIPTION_ID", "SEO_KEYWORDS", "SEO_KEYWORDS_ID", "SEO_OG_IMAGE", "SEO_OG_IMAGE_ID", "SEO_FAVICON", "SEO_GOOGLE_VERIFICATION", "SEO_GA_ID"]);
    const isId = locale === 'id';

    const agencyName = settings.find(s => s.key === "AGENCY_NAME")?.value || "Crediblemark";

    const seoTagline = (isId ? settings.find(s => s.key === "SEO_TITLE_ID")?.value : null) || settings.find(s => s.key === "SEO_TITLE")?.value || "Digital Solutions";
    const seoDesc = (isId ? settings.find(s => s.key === "SEO_DESCRIPTION_ID")?.value : null) || settings.find(s => s.key === "SEO_DESCRIPTION")?.value || "Senior Software House";
    const favicon = settings.find(s => s.key === "SEO_FAVICON")?.value;
    const seoOgImage = (isId ? settings.find(s => s.key === "SEO_OG_IMAGE_ID")?.value : null) || settings.find(s => s.key === "SEO_OG_IMAGE")?.value;
    const googleVerification = settings.find(s => s.key === "SEO_GOOGLE_VERIFICATION")?.value;
    const keywords = (isId ? settings.find(s => s.key === "SEO_KEYWORDS_ID")?.value : null) || settings.find(s => s.key === "SEO_KEYWORDS")?.value;

    const homepageTitle = `${agencyName} | ${seoTagline}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: homepageTitle,
        template: `%s | ${agencyName}`,
      },
      description: seoDesc,
      keywords: keywords,
      verification: {
        google: googleVerification,
      },
      alternates: {
        canonical: locale === 'en' ? `${baseUrl}/en` : `${baseUrl}/id`,
        languages: {
          'en': `${baseUrl}/en`,
          'id': `${baseUrl}/id`,
          'x-default': `${baseUrl}/en`,
        },
      },
      icons: {
        icon: favicon || '/logo.webp',
        shortcut: favicon || '/logo.webp',
        apple: favicon || '/logo.webp',
      },
      openGraph: {
        title: homepageTitle,
        description: seoDesc,
        url: baseUrl,
        siteName: agencyName,
        locale: isId ? 'id_ID' : 'en_US',
        alternateLocale: isId ? ['en_US'] : ['id_ID'],
        type: 'website',
        images: seoOgImage ? [
          {
            url: seoOgImage,
            width: 1200,
            height: 630,
            alt: homepageTitle,
          }
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: homepageTitle,
        description: seoDesc,
        images: seoOgImage ? [seoOgImage] : undefined,
      }
    };
  } catch (error) {
    console.error("[Metadata Debug] Error:", error);
    return {
      title: "Crediblemark",
    };
  }
}

const MarketingPopup = nextDynamic(() => import("@/components/public/marketing-popup").then(mod => mod.MarketingPopup));


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Fetch SEO Settings for GA Script (using cache)
  const seoSettings = await getSystemSettings(["SEO_GA_ID", "AGENCY_ADDRESS", "AGENCY_PHONE", "AGENCY_EMAIL", "AGENCY_LOGO", "AGENCY_NAME", "SEO_DESCRIPTION", "SEO_DESCRIPTION_ID"]);
  const isId = locale === 'id';
  const seoDesc = (isId ? seoSettings.find(s => s.key === "SEO_DESCRIPTION_ID")?.value : null) || seoSettings.find(s => s.key === "SEO_DESCRIPTION")?.value || "Senior Software House";
  const gaId = seoSettings.find(s => s.key === "SEO_GA_ID")?.value;
  const agencyAddress = seoSettings.find(s => s.key === "AGENCY_ADDRESS")?.value;
  const agencyPhone = seoSettings.find(s => s.key === "AGENCY_PHONE")?.value;
  const agencyEmail = seoSettings.find(s => s.key === "AGENCY_EMAIL")?.value;
  const agencyLogo = seoSettings.find(s => s.key === "AGENCY_LOGO")?.value;
  const agencyName = seoSettings.find(s => s.key === "AGENCY_NAME")?.value;



  return (
    <html lang={locale} className="dark">
      <head>
        {/* WebSite JSON-LD Schema for AI & Search Engine Structured Data */}
        <script
          type="application/ld+json"
          id="structured-data-website"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: agencyName || "Crediblemark",
              url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            }),
          }}
        />
        {/* Organization & LocalBusiness JSON-LD Schema */}
        <script
          type="application/ld+json"
          id="structured-data-org"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "LocalBusiness"],
              "@id": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#organization`,
              name: agencyName || "Crediblemark",
              url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              logo: agencyLogo || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.webp`,
              image: agencyLogo || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.webp`,
              description: seoDesc,
              address: {
                "@type": "PostalAddress",
                "streetAddress": agencyAddress || undefined,
                "addressCountry": "ID"
              },
              contactPoint: {
                "@type": "ContactPoint",
                "telephone": agencyPhone || undefined,
                "email": agencyEmail || undefined,
                "contactType": "customer service"
              }
            }),
          }}
        />
        {/* Meta tags PWA */}
        <meta name="theme-color" content="#FFB800" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://i.pravatar.cc" />
        <link rel="alternate" type="application/rss+xml" title="Crediblemark Feed" href="/feed" />

      </head>
      <body className={cn(inter.variable, inter.className, "bg-black text-white antialiased relative")}>
        <NextTopLoader
          color="#FFB800"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FFB800,0 0 5px #FFB800"
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { 'send_page_view': true });
              `}
            </Script>
          </>
        )}

        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <GlobalLoader />
          <ScrollRestorer />
          <Toaster />
          <MarketingPopup />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
