"use client";

import Link from "next/link";
import React from "react";

export function ActionButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <Link href={href} className="flex flex-col items-center justify-center p-6 rounded-bm bg-white border border-bm-border hover:border-bm-fg/20 hover:shadow-soft transition-all active:scale-95 group">
            <div className="mb-3 text-bm-fg group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-bm-fg text-center">{label}</span>
        </Link>
    );
}
