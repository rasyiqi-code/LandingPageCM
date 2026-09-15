"use client";

import React from "react";
import { useConsultation } from "@/lib/store/consultation-store";

interface ChatTriggerProps {
    className?: string;
    children: React.ReactNode;
    asButton?: boolean;
}

export function ChatTrigger({ className, children, asButton = false }: ChatTriggerProps) {
    const { openConsultation } = useConsultation();

    if (asButton) {
        return (
            <button
                onClick={() => openConsultation()}
                className={className}
                type="button"
            >
                {children}
            </button>
        );
    }

    return (
        <span
            onClick={() => openConsultation()}
            className={`${className} cursor-pointer`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    openConsultation();
                }
            }}
        >
            {children}
        </span>
    );
}
