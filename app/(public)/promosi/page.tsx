import { Metadata, ResolvingMetadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getSystemSettings } from "@/lib/server/settings";
import { getPageSeo } from "@/lib/server/seo";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { Mail } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata(
    _props: unknown,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const t = await getTranslations("Promotions");
    const locale = await getLocale();
    const isId = locale === "id";

    const settings = await getSystemSettings(["AGENCY_NAME"]);
    const brand = settings.find((s) => s.key === "AGENCY_NAME")?.value || "Crediblemark";

    const pageSeo = await getPageSeo("/promosi");

    const title = (isId ? pageSeo?.title_id : null) || pageSeo?.title || t("metaTitle", { brand });
    const description = (isId ? pageSeo?.description_id : null) || pageSeo?.description || t("metaDesc");
    const keywords = ((isId ? pageSeo?.keywords_id : null) || pageSeo?.keywords || "").split(",").map((k: string) => k.trim()).filter(Boolean);
    const previousImages = (await parent).openGraph?.images || [];
    const ogImage = (isId ? pageSeo?.ogImage_id : null) || pageSeo?.ogImage;
    const ogImages = ogImage ? [ogImage] : previousImages;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
        title,
        description,
        keywords: keywords.length > 0 ? keywords : undefined,
        openGraph: { title, description, images: ogImages, type: "website", locale: isId ? "id_ID" : "en_US", alternateLocale: isId ? ["en_US"] : ["id_ID"] },
        twitter: { card: "summary_large_image", title, description, images: ogImages },
        alternates: {
            canonical: `${baseUrl}/${locale}/promosi`,
            languages: { en: `${baseUrl}/en/promosi`, id: `${baseUrl}/id/promosi`, "x-default": `${baseUrl}/en/promosi` },
        },
    };
}

export default async function PromosiPage() {
    const t = await getTranslations("Promotions");
    const locale = await getLocale();
    const isId = locale === "id";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <BreadcrumbSchema
                items={[
                    { name: isId ? "Beranda" : "Home", item: `${baseUrl}/${locale}` },
                    { name: isId ? "Promosi" : "Promotions", item: `${baseUrl}/${locale}/promosi` },
                ]}
            />

            <div className="flex flex-col items-center justify-center flex-1 px-4 pt-16 sm:pt-32 pb-16 sm:pb-20">
                <div className="relative mb-8 sm:mb-12 text-center">
                    <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow/10 blur-[120px]" />
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow/10 border border-brand-yellow/20">
                        <Mail className="h-7 w-7 text-brand-yellow" />
                    </div>
                    <h1 className="mb-4 text-3xl sm:text-5xl font-black tracking-tight text-white">
                        {t("title")}{" "}
                        <span className="bg-gradient-to-r from-brand-yellow via-yellow-200 to-brand-yellow bg-clip-text text-transparent">
                            {t("titleHighlight")}
                        </span>
                    </h1>
                    <p className="mx-auto max-w-xl text-sm sm:text-lg text-zinc-400 leading-relaxed px-2">
                        {t("newsletterDesc")}
                    </p>
                </div>

                <div className="w-full max-w-md mx-auto">
                    <NewsletterForm />
                </div>

                <p className="mt-6 text-xs text-zinc-600 text-center max-w-sm">
                    {isId
                        ? "Kami menghargai privasi Anda. Kami hanya mengirimkan informasi promo dan tidak akan membagikan data Anda ke pihak ketiga."
                        : "We value your privacy. We only send promotional information and will never share your data with third parties."}
                </p>
            </div>
        </div>
    );
}
