import React from 'react';
import { getSystemSettings } from "@/lib/server/settings";
import { getPageSeo } from "@/lib/server/seo";
import { getLocale } from "next-intl/server";
import { Metadata } from "next";

import { ResolvingMetadata } from "next";

export async function generateMetadata(
    _props: { params: Promise<Record<string, string>> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const locale = await getLocale();
    // ⚡ Optimasi: Gunakan getPageSeo yang ter-cache (unstable_cache, TTL 1 jam)
    // untuk menghindari query database langsung setiap kali halaman diakses.
    const pageSeo = await getPageSeo("/privacy");

    const isId = locale === 'id';
    const previousImages = (await parent).openGraph?.images || [];
    const ogImages = pageSeo?.ogImage ? [{ url: pageSeo.ogImage }] : previousImages;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const alternates = {
        canonical: `${baseUrl}/${locale}/privacy`,
        languages: {
            'en': `${baseUrl}/en/privacy`,
            'id': `${baseUrl}/id/privacy`,
            'x-default': `${baseUrl}/en/privacy`,
        }
    };

    if (!pageSeo || (!pageSeo.title && !pageSeo.description)) {
        return {
            title: isId ? "Kebijakan Privasi" : "Privacy Policy",
            openGraph: {
                title: isId ? "Kebijakan Privasi" : "Privacy Policy",
                images: ogImages,
                type: "website",
                locale: isId ? 'id_ID' : 'en_US',
                alternateLocale: isId ? ['en_US'] : ['id_ID'],
            },
            twitter: {
                card: "summary_large_image",
                title: isId ? "Kebijakan Privasi" : "Privacy Policy",
                images: ogImages,
            },
            alternates
        };
    }

    const title = (isId ? pageSeo.title_id : null) || pageSeo.title || (isId ? "Kebijakan Privasi" : "Privacy Policy");
    const description = (isId ? pageSeo.description_id : null) || pageSeo.description || undefined;
    const keywords = ((isId ? pageSeo.keywords_id : null) || pageSeo.keywords || "").split(",").map((k: string) => k.trim()).filter(Boolean);

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: ogImages,
            type: "website",
            locale: isId ? 'id_ID' : 'en_US',
            alternateLocale: isId ? ['en_US'] : ['id_ID'],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImages,
        },
        alternates
    };
}

export default async function PrivacyPolicyPage() {
    const locale = await getLocale();
    const isId = locale === 'id';

    // ⚡ Get settings dari env/static (tanpa database) via getSystemSettings.
    const settings = await getSystemSettings(["AGENCY_NAME", "COMPANY_NAME"]);
    const agencyName = settings.find(s => s.key === "AGENCY_NAME")?.value || "Crediblemark";
    const companyName = settings.find(s => s.key === "COMPANY_NAME")?.value || "Crediblemark";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 p-8 md:p-24 font-sans leading-relaxed">
            <div className="max-w-4xl mx-auto space-y-12">
                {isId ? (
                    <>
                        <header className="space-y-4 border-b border-white/10 pb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Kebijakan Privasi</h1>
                            <p className="text-zinc-500">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </header>

                        <div className="space-y-8 text-base md:text-lg">
                            <p>
                                Selamat datang di **{agencyName}** (&quot;Kami&quot;, &quot;Platform&quot; atau &quot;{companyName}&quot;). Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan menjaga informasi Anda saat Anda menggunakan situs web dan layanan kami.
                            </p>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">1. Informasi yang Kami Kumpulkan</h2>
                                <ul className="list-disc pl-6 space-y-2 marker:text-brand-yellow">
                                    <li>
                                        <strong className="text-white">Informasi Kontak:</strong> Nama, alamat email, dan nomor telepon yang Anda berikan melalui formulir kontak atau pesan WhatsApp.
                                    </li>
                                    <li>
                                        <strong className="text-white">Informasi Proyek:</strong> Detail kebutuhan dan data yang Anda sampaikan saat berkonsultasi atau memesan layanan {agencyName}.
                                    </li>
                                    <li>
                                        <strong className="text-white">Informasi Teknis:</strong> Alamat IP, jenis browser, data log, dan cookie untuk sesi login dan keamanan.
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">2. Cara Kami Menggunakan Informasi Anda</h2>
                                <p>Kami menggunakan data Anda untuk:</p>
                                <ul className="list-disc pl-6 space-y-2 marker:text-brand-yellow">
                                    <li>Menyediakan, mengoperasikan, dan memelihara layanan {agencyName}.</li>
                                    <li>Menanggapi pertanyaan dan kebutuhan Anda melalui formulir kontak atau WhatsApp.</li>
                                    <li>Berkomunikasi dengan Anda terkait update proyek, layanan pelanggan, atau perubahan kebijakan.</li>
                                    <li>Mendeteksi dan mencegah penyalahgunaan atau akses tidak sah.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">7. Hubungi Kami</h2>
                                <p>
Jika Anda memiliki pertanyaan tentang kebijakan ini, silakan hubungi tim kami melalui halaman Kontak.
                                    </p>
                            </section>
                        </div>
                    </>
                ) : (
                    <>
                        <header className="space-y-4 border-b border-white/10 pb-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
                            <p className="text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </header>

                        <div className="space-y-8 text-base md:text-lg">
                            <p>
                                Welcome to **{agencyName}** (&quot;We&quot;, &quot;Platform&quot; or &quot;{companyName}&quot;). We value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                            </p>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                                <ul className="list-disc pl-6 space-y-2 marker:text-brand-yellow">
                                    <li>
                                        <strong className="text-white">Contact Information:</strong> Name, email address, and phone number that you provide through our contact form or WhatsApp messages.
                                    </li>
                                    <li>
                                        <strong className="text-white">Project Information:</strong> Details and data you share when consulting or ordering {agencyName} services.
                                    </li>
                                    <li>
                                        <strong className="text-white">Technical Information:</strong> IP address, browser type, log data, and cookies for login sessions and security.
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                                <p>We use your data to:</p>
                                <ul className="list-disc pl-6 space-y-2 marker:text-brand-yellow">
                                    <li>Provide, operate, and maintain {agencyName} services.</li>
                                    <li>Respond to your questions and needs via the contact form or WhatsApp.</li>
                                    <li>Communicate with you regarding project updates, customer support, or policy changes.</li>
                                    <li>Detect and prevent abuse or unauthorized access.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
                                <p>
                                    If you have any questions about this policy, please contact our team via the Contact page.
                                </p>
                            </section>
                        </div>
                    </>
                )}

                <footer className="pt-12 border-t border-white/10 text-sm text-zinc-500 flex justify-between">
                    <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
