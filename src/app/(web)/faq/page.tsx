"use client";

import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui-bm/button";
import { Badge } from "@/components/ui-bm/badge";
import { Logo } from "@/components/ui-bm/logo";
import { JsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { useState } from "react";

const faqData = [
    {
        q: "Platformadagi darslar har kuni yangilanadimi?",
        a: "Bizda ham doimiy kurslar, ham yangilanib turadigan klub formatidagi darslar mavjud. Kursni sotib olganingizda, barcha darslarga bir necha oylik (yoki umrbod) kirish huquqiga ega bo'lasiz."
    },
    {
        q: "Yoga uchun maxsus jihozlar sotib olishim kerakmi?",
        a: "Dastlabki bosqichda faqatgina yoga gilamchasi (kovrik) va qulay sport kiyimi kifoya. Ba'zi darslarda yoga bloklari yoki kamarlaridan foydalanamiz, lekin ularni uy sharoitidagi buyumlar bilan almashtirish mumkin."
    },
    {
        q: "To'lovni qanday amalga oshirsa bo'ladi?",
        a: "To'lovlarni Click va Payme tizimlari orqali to'g'ridan-to'g'ri platformamizda yoki Telegram Mini App'da amalga oshirishingiz mumkin. Xorijiy kartalar bilan to'lov bo'yicha admin bilan bog'laning."
    },
    {
        q: "Darslarni qaysi vaqtda bajarishim kerak?",
        a: "Darslar oldindan yozib olingan bo'ladi, shuning uchun siz o'zingizga qulay vaqtda — xoh ertalab, xoh kechqurun shug'ullana olasiz."
    },
    {
        q: "Sog'lig'imda muammolar bo'lsa shug'ullanishim mumkinmi?",
        a: "Agar sizda grija, umurtqa pog'onasi muammolari yoki boshqa surunkali kasalliklar bo'lsa, avval shifokor bilan maslahatlashing. Sabina Polatova yogaterapiya bo'yicha mutaxassis bo'lgani uchun, u darslarda har qanday holatga moslashgan yumshoq topshiriqlarni berib o'tadi."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <div className="min-h-screen bg-white text-bm-fg selection:bg-bm-fg selection:text-white pb-32">
            <JsonLd data={faqJsonLd} />

            {/* Nav */}
            <nav className="flex items-center justify-between px-10 py-8 border-b border-bm-border/50 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                <Link href="/"><Logo /></Link>
                <div className="flex gap-4">
                    <Link href="/courses"><Button variant="outline" size="sm">Kurslar</Button></Link>
                    <Button variant="primary" size="sm">Mini App</Button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-10 pt-24 space-y-20">
                {/* Header */}
                <div className="text-center space-y-6">
                    <Badge variant="beige">Yordam Markazi</Badge>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
                        Ko'p beriladigan <br /> <span className="text-bm-muted font-light">savollar</span>
                    </h1>
                    <p className="text-bm-muted font-light max-w-xl mx-auto">
                        Baxtli Men platformasi haqida barcha kerakli ma'lumotlarni shu erdan topishingiz mumkin. Agar savolingiz bo'lsa, bizga murojaat qiling.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqData.map((item, idx) => (
                        <div
                            key={idx}
                            className={`border border-bm-border rounded-bm overflow-hidden transition-all duration-300 ${openIndex === idx ? 'bg-bm-surface shadow-soft' : 'bg-white'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full p-8 flex items-center justify-between text-left group"
                            >
                                <span className={`text-lg font-bold uppercase tracking-tight transition-colors ${openIndex === idx ? 'text-bm-fg' : 'text-bm-muted group-hover:text-bm-fg'}`}>
                                    {item.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full border border-bm-border flex items-center justify-center transition-transform duration-300 ${openIndex === idx ? 'rotate-180 bg-bm-fg text-white' : 'rotate-0'}`}>
                                    {openIndex === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>

                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-8 pb-8"
                                >
                                    <div className="pt-4 border-t border-bm-border/50 text-bm-muted font-light leading-relaxed">
                                        {item.a}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="p-10 bg-bm-fg text-white rounded-bm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Savolingiz qoldimi?</h3>
                        <p className="text-white/60 font-light text-sm">Bizning jamoamiz xushmuomalalik bilan javob beradi.</p>
                    </div>
                    <Button variant="secondary" size="lg" className="px-10 bg-white text-bm-fg hover:bg-bm-accent-beige">
                        Bog'lanish <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </main>
        </div>
    );
}
