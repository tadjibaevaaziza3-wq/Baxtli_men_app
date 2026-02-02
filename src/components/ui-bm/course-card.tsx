"use client";

import { motion } from "framer-motion";
import { Card } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { PlayCircle, Clock } from "lucide-react";

interface CourseCardProps {
    title: string;
    type: string;
    description: string;
    priceUzs: number;
    durationDays: number;
    imageUrl?: string;
    onClick?: () => void;
}

export function CourseCard({ title, type, description, priceUzs, durationDays, imageUrl, onClick }: CourseCardProps) {
    return (
        <Card className="group overflow-hidden flex flex-col hover:border-bm-fg/30 transition-all">
            <div className="relative aspect-video bg-bm-surface overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-bm-border">
                        <PlayCircle className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <Badge variant="beige">{type}</Badge>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg text-bm-fg tracking-tight uppercase leading-tight">{title}</h3>
                </div>

                <p className="text-xs text-bm-muted line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="pt-4 mt-auto border-t border-bm-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-bm-muted uppercase font-bold tracking-widest">Naxri</span>
                        <span className="text-sm font-black text-bm-fg">{priceUzs.toLocaleString()} <span className="text-[10px] font-normal">UZS</span></span>
                    </div>

                    <div className="flex items-center gap-1 text-bm-muted text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        {durationDays} KUN
                    </div>
                </div>

                <Button variant="primary" size="sm" className="w-full" onClick={onClick}>
                    Batafsil
                </Button>
            </div>
        </Card>
    );
}
