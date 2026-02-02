"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CourseCard } from "@/components/ui-bm/course-card";
import { Badge } from "@/components/ui-bm/badge";

type ProductType = "ONLINE_COURSE" | "ONLINE_SUBSCRIPTION" | "OFFLINE_PACKAGE" | "CONSULTATION";

interface Product {
    id: string;
    title: string;
    description: string;
    priceUzs: number;
    type: ProductType;
    durationDays: number;
}

const typeLabels: Record<string, string> = {
    ALL: "Hammasi",
    ONLINE_COURSE: "Kurslar",
    ONLINE_SUBSCRIPTION: "Klub",
    OFFLINE_PACKAGE: "Offline",
};

export default function CoursesPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>("ALL");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.products) {
                    setProducts(data.products);
                    setFilteredProducts(data.products);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeFilter === "ALL") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.type === activeFilter));
        }
    }, [activeFilter, products]);

    const filters = ["ALL", "ONLINE_COURSE", "ONLINE_SUBSCRIPTION", "OFFLINE_PACKAGE"];

    return (
        <div className="min-h-screen bg-white text-bm-fg pb-20">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-bm-border px-4 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-bm-surface rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-bm-fg" />
                </button>
                <h1 className="text-sm font-black uppercase tracking-widest text-bm-fg">Portfolio</h1>
                <div className="w-10" />
            </header>

            <div className="p-6 space-y-8">
                {/* Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === f
                                ? "bg-bm-fg text-white border-bm-fg shadow-lg"
                                : "bg-white text-bm-muted border-bm-border hover:border-bm-muted"
                                }`}
                        >
                            {typeLabels[f]}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-bm-border mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-bm-muted">Yuklanmoqda...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                >
                                    <CourseCard
                                        title={p.title}
                                        type={p.type.replace("_", " ")}
                                        description={p.description}
                                        priceUzs={p.priceUzs}
                                        durationDays={p.durationDays}
                                        onClick={() => router.push(`/tma/courses/${p.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center text-bm-muted text-xs font-bold italic">
                                Hozircha bu bo'limda mahsulotlar yo'q.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
