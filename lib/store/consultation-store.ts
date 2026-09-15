"use client";

import { useRouter } from "next/navigation";

let latestMessage = "";

export function useConsultation() {
    const router = useRouter();

    const openConsultation = () => {
        const base = "/contact";
        const url = latestMessage ? `${base}?message=${encodeURIComponent(latestMessage.slice(0, 500))}` : base;
        latestMessage = "";
        router.push(url);
    };

    return {
        openConsultation,
        setDefaultInput: (value: string) => {
            latestMessage = value;
        },
    };
}