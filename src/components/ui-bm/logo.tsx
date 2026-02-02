import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LogoProps {
    variant?: "full" | "icon";
    className?: string;
}

export function Logo({ variant = "full", className }: LogoProps) {
    if (variant === "icon") {
        return (
            <div className={cn("relative w-12 h-12 overflow-hidden rounded-full", className)}>
                {/* Focus on the symbol at the top of the official logo */}
                <img
                    src="/brand/logo-original.png"
                    alt="Baxtli Men Icon"
                    className="absolute w-[180%] h-[180%] max-w-none -top-[5%] left-1/2 -translate-x-1/2 grayscale"
                    style={{ objectPosition: 'top' }}
                />
            </div>
        );
    }

    return (
        <div className={cn("flex items-center select-none shrink-0", className)}>
            <img
                src="/brand/logo-original.png"
                alt="Baxtli Men Logo"
                className="h-16 w-auto grayscale"
            />
        </div>
    );
}
