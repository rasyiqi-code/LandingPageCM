"use client";

import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const currentLocale = pathname?.split('/')[1]?.length === 2 ? pathname.split('/')[1] : 'en';

    const toggle = () => {
        const newLocale = currentLocale === 'en' ? 'id' : 'en';

        const segments = pathname?.split('/') || [];
        if (segments[1]?.length === 2) {
            segments[1] = newLocale;
        } else {
            segments.splice(1, 0, newLocale);
        }

        const newPath = segments.join('/') || '/';
        const queryString = searchParams?.toString();
        const newPathWithParams = queryString ? `${newPath}?${queryString}` : newPath;

        startTransition(() => {
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
            router.push(newPathWithParams);
            router.refresh();
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            disabled={isPending}
            className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/10"
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-yellow" />
            ) : (
                <Globe className="w-3.5 h-3.5 text-brand-yellow" />
            )}
            <span className="font-mono text-xs font-semibold">
                {!mounted ? '...' : (currentLocale === 'en' ? 'EN' : 'ID')}
            </span>
        </Button>
    );
}