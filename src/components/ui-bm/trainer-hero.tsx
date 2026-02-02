"use client";

import { motion } from "framer-motion";
import { Logo } from "./logo";
import { Badge } from "./badge";

interface TrainerHeroProps {
    name: string;
    bio: string;
    imageUrl?: string;
}

export function TrainerHero({ name, bio, imageUrl }: TrainerHeroProps) {
    return (
        <div className="space-y-8 py-10">
            <header className="flex justify-between items-center px-6">
                <Logo />
            </header>

            <div className="relative px-6 flex flex-col items-center text-center space-y-4">
                <div className="w-32 h-32 rounded-full border-4 border-bm-surface overflow-hidden shadow-soft relative bg-bm-surface flex items-center justify-center">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-bm-muted font-black text-2xl">
                            SP
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <Badge variant="beige">Trainer & Founder</Badge>
                    <h1 className="text-3xl font-black text-bm-fg tracking-tighter uppercase">{name}</h1>
                    <p className="bm-signature text-xl text-bm-muted">by Sabina Polatova</p>
                </div>

                <p className="text-sm text-bm-muted max-w-xs leading-relaxed">
                    {bio}
                </p>
            </div>
        </div>
    );
}
