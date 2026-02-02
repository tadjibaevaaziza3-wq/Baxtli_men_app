"use client";

import { motion } from "framer-motion";
import { ArrowRight, Instagram, Send, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";
import { Logo } from "@/components/ui-bm/logo";
import Link from "next/link";
import React from "react";

export default function HomeClient() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-bm-fg selection:bg-bm-fg selection:text-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-10 py-8 sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-bm-border/50">
                <Logo />
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/trainer" className="text-[10px] font-black uppercase tracking-widest text-bm-muted hover:text-bm-fg transition-colors">Biz haqimizda</Link>
                    <Link href="/courses" className="text-[10px] font-black uppercase tracking-widest text-bm-muted hover:text-bm-fg transition-colors">Kurslar</Link>
                    <Link href="/faq" className="text-[10px] font-black uppercase tracking-widest text-bm-muted hover:text-bm-fg transition-colors">Yordam</Link>
                    <Link href="/tma">
                        <Button variant="primary" size="sm" className="shadow-lg shadow-bm-fg/10">
                            Mini App'ni ochish
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="px-10 py-24 md:py-40 flex flex-col items-center text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 max-w-4xl"
                    >
                        <Badge variant="beige" className="px-4 py-1.5 border border-bm-accent-beige">Premium Wellness Experience</Badge>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-bm-fg">
                            Sog'lom tana <br />
                            <span className="text-bm-muted">va baxtli hayot</span>
                        </h1>
                        <p className="bm-signature text-3xl md:text-5xl text-bm-muted">by Sabina Polatova</p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl text-lg text-bm-muted font-light leading-relaxed"
                    >
                        Ayollar uchun mo'ljallangan eksklyuziv yoga platformasi. Biz bilan o'zligingizni anglang va ichki xotirjamlikni toping.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
                    >
                        <Button variant="primary" size="lg" className="px-12 group shadow-2xl shadow-bm-fg/20">
                            Start Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="lg" className="px-12">
                            Instagram
                        </Button>
                    </motion.div>
                </section>

                {/* Feature Grid */}
                <section className="px-10 py-24 bg-bm-surface border-y border-bm-border">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                        <Feature
                            icon={<Globe className="w-8 h-8" />}
                            title="Istalgan joyda"
                            desc="Online darslarimiz orqali dunyoning istalgan nuqtasidan turib shug'ullaning."
                        />
                        <Feature
                            icon={<Shield className="w-8 h-8" />}
                            title="Xavfsiz va Sifatli"
                            desc="Eksklyuziv kontent va professional yondashuv bilan natijaga kafolat beramiz."
                        />
                        <Feature
                            icon={<Send className="w-8 h-8" />}
                            title="TMA Concierge"
                            desc="Telegram Mini App orqali barcha kurslaringiz hamisha yoningizda."
                        />
                    </div>
                </section>

                {/* Brand Philosophy */}
                <section id="about" className="px-10 py-40 flex flex-col md:flex-row items-center gap-20 max-w-7xl mx-auto">
                    <div className="flex-1 space-y-8">
                        <Badge variant="beige">Philosophy</Badge>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                            Biz nafaqat yoga, <br /> balki baxt ulashamiz.
                        </h2>
                        <p className="text-xl text-bm-muted font-light leading-relaxed">
                            Baxtli Men — bu shunchaki kurslar emas, bu o'zgarishlar maskani. Sabina Polatova bilan birga yangi bosqichga ko'tariling.
                        </p>
                        <Button variant="outline" className="border-bm-fg text-bm-fg hover:bg-bm-fg hover:text-white px-10">
                            Batafsil
                        </Button>
                    </div>
                    <div className="flex-1 w-full aspect-square bg-bm-surface rounded-bm overflow-hidden border border-bm-border relative group shadow-soft">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uploaded_media_1770008999382-7YOn0e6N3X9hQ7N4S5U1R2E3T.png"
                            alt="Sabina Polatova"
                            className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                        <div className="absolute bottom-10 left-10">
                            <p className="bm-signature text-4xl text-bm-fg">Sabina Polatova</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="px-10 py-20 border-t border-bm-border bg-bm-surface text-center space-y-8">
                <Logo className="justify-center" />
                <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-bm-muted">
                    <Link href="/faq" className="hover:text-bm-fg transition-colors underline underline-offset-4">FAQ</Link>
                    <Link href="/trainer" className="hover:text-bm-fg transition-colors underline underline-offset-4">About</Link>
                    <a href="#" className="hover:text-bm-fg transition-colors underline underline-offset-4">Contact</a>
                </div>
                <p className="text-[10px] text-bm-muted font-bold tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Baxtli Men. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center text-center space-y-6 group">
            <div className="p-6 bg-white rounded-bm border border-bm-border shadow-soft group-hover:bg-bm-accent group-hover:text-white transition-all group-hover:-translate-y-2">
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
                <p className="text-sm text-bm-muted font-light leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
