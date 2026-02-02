"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BookOpen,
    CreditCard,
    Brain,
    MessageSquare,
    Phone,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AgreementModal } from "@/components/agreement-modal";
import { ActionButton } from "@/components/ui-bm/action-button";
import { TrainerHero } from "@/components/ui-bm/trainer-hero";
import { CourseCard } from "@/components/ui-bm/course-card";
import { Logo } from "@/components/ui-bm/logo";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";

export default function TMAPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [showAgreement, setShowAgreement] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            const checkAgreement = async () => {
                const res = await fetch("/api/user/agreement-status");
                const data = await res.json();
                if (!data.accepted) {
                    setShowAgreement(true);
                }
            };
            checkAgreement();
        }
    }, [user, authLoading]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.products) {
                    setProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-bm-fg">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-bm-accent" />
                <p className="animate-pulse font-medium uppercase tracking-widest text-[10px]">Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-bm-fg pb-24">
            {/* Minimal Logo Bar */}
            <div className="px-6 pt-6 -mb-6 flex justify-start">
                <Logo variant="icon" />
            </div>

            {/* Hero Section */}
            <TrainerHero
                name="SABINA POLATOVA"
                bio="Baxtli Men — sizning sog'lom tana va baxtli hayot sari yo'lingiz. 🧘‍♀️"
                imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uploaded_media_1770008999382-7YOn0e6N3X9hQ7N4S5U1R2E3T.png"
            />

            <div className="px-6 space-y-12">
                {/* Concierge Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <ActionButton
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Kurslar"
                        href="/tma/courses"
                    />
                    <ActionButton
                        icon={<Brain className="w-5 h-5" />}
                        label="AI Assistant"
                        href="/tma/ai"
                    />
                    <ActionButton
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Chatlarim"
                        href="/tma/chats"
                    />
                    <ActionButton
                        icon={<CreditCard className="w-5 h-5" />}
                        label="Sotib olish"
                        href="/tma/courses"
                    />
                </div>

                {/* Popular Courses */}
                <div className="space-y-6">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <Badge variant="beige">Mashhur</Badge>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Siz uchun tanlangan</h2>
                        </div>
                        <button
                            onClick={() => router.push("/tma/courses")}
                            className="text-[10px] font-black uppercase tracking-widest text-bm-muted hover:text-bm-fg transition-colors flex items-center gap-1"
                        >
                            Hammasi <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {productsLoading ? (
                            <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-bm-border" /></div>
                        ) : (
                            products.slice(0, 2).map((p) => (
                                <CourseCard
                                    key={p.id}
                                    title={p.title}
                                    type={p.type.replace("_", " ")}
                                    description={p.description}
                                    priceUzs={p.priceUzs}
                                    durationDays={p.durationDays}
                                    onClick={() => router.push(`/tma/courses/${p.id}`)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Contact Card */}
                <div className="bg-bm-surface rounded-bm border border-bm-border p-6 flex items-center justify-between group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-bm-accent-beige/20 rounded-full blur-2xl" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-bm-border shadow-soft">
                            <Phone className="w-5 h-5 text-bm-fg" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-bm-muted tracking-widest">Yordam kerakmi?</p>
                            <p className="font-bold text-sm tracking-tight text-bm-fg">@Sabina_Polatova</p>
                        </div>
                    </div>
                    <a
                        href="https://t.me/Sabina_Polatova"
                        target="_blank"
                        className="relative z-10 bg-bm-accent text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                    >
                        Yozish
                    </a>
                </div>
            </div>

            <AgreementModal
                isOpen={showAgreement}
                onAccept={() => setShowAgreement(false)}
            />
        </div>
    );
}
