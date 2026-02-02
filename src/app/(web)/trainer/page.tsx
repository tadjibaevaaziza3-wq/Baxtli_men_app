"use client";

import { motion } from "framer-motion";
import { Instagram, Send, Star, Award, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";
import { Logo } from "@/components/ui-bm/logo";
import Link from "next/link";

export default function TrainerPage() {
    return (
        <div className="min-h-screen bg-white text-bm-fg selection:bg-bm-fg selection:text-white pb-32">
            {/* Nav */}
            <nav className="flex items-center justify-between px-10 py-8 border-b border-bm-border/50 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                <Link href="/"><Logo /></Link>
                <div className="flex gap-4">
                    <Link href="/courses"><Button variant="outline" size="sm">Kurslar</Button></Link>
                    <Button variant="primary" size="sm">Mini App</Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-10 pt-20">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    {/* Left: Image Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 w-full relative group"
                    >
                        <div className="aspect-[4/5] bg-bm-surface rounded-bm overflow-hidden border border-bm-border shadow-soft relative transition-all group-hover:shadow-2xl group-hover:shadow-bm-fg/5">
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uploaded_media_1770008999382-7YOn0e6N3X9hQ7N4S5U1R2E3T.png"
                                alt="Sabina Polatova"
                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Highlights Floating */}
                        <div className="absolute -bottom-6 -right-6 p-8 bg-white rounded-bm border border-bm-border shadow-2xl space-y-4 hidden md:block">
                            <HighlightItem icon={<Star className="w-4 h-4 text-bm-fg" />} label="10+ Yillik tajriba" />
                            <HighlightItem icon={<Award className="w-4 h-4 text-bm-fg" />} label="Xalqaro sertifikatlar" />
                            <HighlightItem icon={<Heart className="w-4 h-4 text-bm-fg" />} label="5000+ O'quvchilar" />
                        </div>
                    </motion.div>

                    {/* Right: Bio Content */}
                    <div className="flex-1 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Badge variant="beige">Expert Trainer & Founder</Badge>
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                                Sabina <br /> <span className="text-bm-muted font-light">Polatova</span>
                            </h1>
                            <p className="bm-signature text-4xl text-under-bm-fg">by Sabina Polatova</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8 text-lg text-bm-muted font-light leading-relaxed max-w-xl"
                        >
                            <p>
                                Assalomu alaykum! Men Sabina Polatova — yogaterapevt, ayollar salomatligi bo'yicha ekspert va **Baxtli Men** platformasi asoschisiman.
                            </p>
                            <p>
                                Mening maqsadim — har bir ayolga o'z tanasini sevishni, ichki xotirjamlikni topishni va zamonaviy dunyoda garmoniyada yashashni o'rgatish. 10 yildan ortiq vaqt davomida men yoga orqali minglab ayollarning hayotini o'zgartirishga yordam berdim.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold uppercase tracking-widest text-bm-fg pt-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Hatha Yoga</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Yogaterapiya</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Meditatsiya</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Sog'lom ovqatlanish</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <Button size="lg" className="px-12 shadow-2xl shadow-bm-fg/20">
                                Kurslarga a'zo bo'lish
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" size="lg" className="px-6 h-14">
                                    <Instagram className="w-6 h-6" />
                                </Button>
                                <Button variant="outline" size="lg" className="px-6 h-14">
                                    <Send className="w-6 h-6" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Secondary Section: Philosophy */}
                <section className="mt-40 py-24 border-t border-bm-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <PhilosophyBlock
                            title="Xavfsizlik"
                            text="Bizning barcha darslarimiz fiziologik jihatdan to'g'ri va xavfsiz tuzilgan. Tanangizni zo'riqtirmasdan natijaga erishasiz."
                        />
                        <PhilosophyBlock
                            title="Natija"
                            text="Har bir mashg'ulot aniq maqsadga yo'naltirilgan: bo'g'imlar harakatchanligi, tana tarangligi yoki ruhiy xotirjamlik."
                        />
                        <PhilosophyBlock
                            title="Hamjamiyat"
                            text="Baxtli Men — bu shunchaki platforma emas, bu fikrdosh ayollarning katta va iliq hamjamiyatidir."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

function HighlightItem({ icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center gap-3 group/item">
            <div className="w-8 h-8 rounded-full bg-bm-surface flex items-center justify-center transition-colors group-hover/item:bg-bm-accent group-hover/item:text-white">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

function PhilosophyBlock({ title, text }: { title: string, text: string }) {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-bm-fg pl-4">{title}</h3>
            <p className="text-bm-muted font-light leading-relaxed">{text}</p>
        </div>
    );
}
