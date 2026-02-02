"use client";

import { CreditCard, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PaymentMethodSelectorProps {
    value: "click" | "payme" | null;
    onChange: (val: "click" | "payme") => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    const methods = [
        { id: "click", label: "Click", color: "#0099ff" }, // Will be monochrome but keep label
        { id: "payme", label: "Payme", color: "#33cccc" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => onChange(m.id as any)}
                    className={cn(
                        "relative p-6 rounded-bm border-2 transition-all flex flex-col items-center gap-2 group",
                        value === m.id
                            ? "border-bm-fg bg-bm-fg text-white shadow-lg"
                            : "border-bm-border bg-white text-bm-fg hover:border-bm-muted"
                    )}
                >
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        value === m.id ? "bg-white text-bm-fg" : "bg-bm-surface text-bm-muted"
                    )}>
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{m.label}</span>

                    {value === m.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white text-bm-fg rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
