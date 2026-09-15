"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useConsultation } from "@/lib/store/consultation-store";

interface CtaChatButtonProps {
    className?: string;
    children?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    ariaLabel?: string;
}

export function CtaChatButton({ className, children, variant, size, ariaLabel }: CtaChatButtonProps) {
    const { openConsultation } = useConsultation();

    return (
        <Button
            onClick={() => openConsultation()}
            variant={variant}
            size={size}
            className={className}
            aria-label={ariaLabel}
        >
            {children}
        </Button>
    );
}
