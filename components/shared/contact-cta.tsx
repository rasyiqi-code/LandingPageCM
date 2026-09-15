import Link from "next/link";
import { getLocale } from "next-intl/server";
import { cn } from "@/lib/shared/utils";

export async function ContactCTA({ className }: { className?: string }) {
    const locale = await getLocale();
    return (
        <Link
            href={`/${locale}/contact`}
            className={cn("inline-flex items-center justify-center", className)}
        >
            {locale === "id" ? "Minta Penawaran" : "Request a Quote"}
        </Link>
    );
}