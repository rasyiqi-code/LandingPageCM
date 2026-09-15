import { ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { getSettingValue } from "@/lib/server/settings";
import { getTranslations } from "next-intl/server";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const t = await getTranslations("Verify");
    const agencyName = await getSettingValue("AGENCY_NAME", "Crediblemark");

    return {
        title: t("metaTitle", { id: id.slice(-8).toUpperCase(), brand: agencyName }),
        description: t("metaDesc", { brand: agencyName }),
        robots: "noindex, nofollow"
    };
}

export default async function VerifyInvoicePage({ params }: PageProps) {
    const { id } = await params;
    const t = await getTranslations("Verify");
    const agencyName = await getSettingValue("AGENCY_NAME", "Crediblemark");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#312e81,transparent_50%)] opacity-30" />

            <div className="relative w-full max-w-xl">
                {/* Status Card */}
                <div className="rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl bg-red-950/20">
                    {/* Header Banner */}
                    <div className="h-2 w-full bg-amber-500" />

                    <div className="p-8 md:p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="w-10 h-10 text-amber-400" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{t("failedTitle")}</h1>
                            <p className="text-zinc-400 mb-8 max-w-sm">
                                {t("verifyContact")}
                            </p>

                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 w-full mb-8">
                                <div className="text-amber-400 text-sm font-medium mb-1 uppercase tracking-widest">{t("invalidId")}</div>
                                <div className="font-mono text-xs opacity-50 break-all">{id}</div>
                            </div>

                            <Link
                                href="/contact"
                                className="px-8 py-3 bg-amber-500 hover:bg-amber-500/90 text-black font-bold rounded-full transition-colors"
                            >
                                {t("contactSupport")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="mt-8 flex flex-col items-center gap-4 opacity-50">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-sm rotate-45" />
                        </div>
                        <span className="font-bold tracking-tight">{agencyName}</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em]">{t("portalTitle")}</p>
                </div>
            </div>
        </div>
    );
}