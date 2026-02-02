"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Share2,
    Clock,
    PlayCircle,
    Calendar,
    Users,
    Loader2,
    Lock,
    MessageSquare,
    CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";
import { Logo } from "@/components/ui-bm/logo";

interface Product {
    id: string;
    title: string;
    description: string;
    priceUzs: number;
    type: string;
    durationDays: number;
    course?: {
        modules: {
            id: string;
            title: string;
            lessons: { id: string; title: string }[];
        }[];
    };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                if (data.product) {
                    setProduct(data.product);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-bm-fg">
                <Loader2 className="w-10 h-10 animate-spin text-bm-accent mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-bm-muted">Yuklanmoqda...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-bm-fg p-6 text-center">
                <h1 className="text-xl font-black uppercase mb-4">Mahsulot topilmadi</h1>
                <Button onClick={() => router.push("/tma/courses")} variant="outline">
                    Ortga qaytish
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-bm-fg pb-32">
            {/* Header / Logo */}
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-bm-border">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-bm-surface rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-bm-fg" />
                </button>
                <Logo variant="icon" />
                <button className="p-2 -mr-2 hover:bg-bm-surface rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-bm-fg" />
                </button>
            </header>

            {/* Hero Cover */}
            <div className="relative h-48 bg-bm-surface overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-5 flex items-center justify-center pattern-grid-lg" />
                <div className="relative z-10 w-24 h-24 rounded-full border border-bm-border bg-white flex items-center justify-center shadow-soft">
                    <Calendar className="w-8 h-8 text-bm-muted" />
                </div>
            </div>

            {/* Content Container */}
            <div className="px-6 -mt-8 relative z-10">
                <div className="p-8 rounded-bm bg-white border border-bm-border shadow-soft space-y-6">
                    <div className="flex justify-between items-start">
                        <Badge variant="beige">{product.type.replace("_", " ")}</Badge>
                        <div className="flex items-center gap-1 text-bm-muted">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{product.durationDays} KUN</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">{product.title}</h1>
                        <p className="bm-signature text-xl text-bm-muted -mt-2">by Sabina Polatova</p>
                    </div>

                    <p className="text-sm text-bm-muted leading-relaxed font-light">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-bm-muted pt-4 border-t border-bm-border">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>1,200+ O'quvchilar</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Doimiy kirish</span>
                        </div>
                    </div>
                </div>

                {/* Secure Video Player */}
                <div className="mt-12 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Badge>Kirish darsi</Badge>
                    </div>
                    <VideoPlayer initialSrc="5d5b37ca257ef0c1669D5b37ca257ef0c1669" />
                    <p className="text-[10px] text-bm-muted text-center italic uppercase font-bold tracking-widest">
                        Butun kursni ko'rish uchun sotib oling
                    </p>
                </div>

                {/* Curriculum */}
                {product.course && (
                    <div className="mt-12 space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tighter ml-1">Kurs dasturi</h2>
                        <div className="space-y-3">
                            {product.course.modules.map((module, idx) => (
                                <div
                                    key={module.id}
                                    className="p-5 rounded-bm bg-bm-surface border border-bm-border flex items-center gap-4 group transition-all hover:border-bm-muted"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white border border-bm-border flex items-center justify-center text-bm-fg font-black text-xs shadow-soft shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm uppercase tracking-tight">{module.title}</h4>
                                        <p className="text-[10px] text-bm-muted font-bold tracking-widest uppercase">{module.lessons.length} TA DARS</p>
                                    </div>
                                    <Lock className="w-4 h-4 text-bm-border group-hover:text-bm-muted transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t border-bm-border z-50">
                <div className="flex items-center justify-between gap-8 max-w-lg mx-auto">
                    <div className="shrink-0 flex flex-col">
                        <p className="text-[10px] font-black uppercase tracking-widest text-bm-muted">Narxi</p>
                        <h2 className="text-2xl font-black tracking-tighter">
                            {product.priceUzs.toLocaleString()} <span className="text-xs font-normal text-bm-muted">UZS</span>
                        </h2>
                    </div>
                    <Button
                        variant="primary"
                        className="flex-1 shadow-lg shadow-bm-fg/10"
                        onClick={() => alert("To'lov tizimi yaqin kunlarda ishga tushadi! 🧘‍♀️")}
                    >
                        Hoziroq sotib olish
                    </Button>
                </div>
            </div>
        </div>
    );
}
