"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui-bm/badge";
import { Button } from "@/components/ui-bm/button";
import { Logo } from "@/components/ui-bm/logo";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: { id: string, title: string }[];
}

export default function AIChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Assalomu alaykum! Men Baxtli Men AI yordamchisiman. Yoga, sog'lom turmush tarzi va kurslar haqida savollaringiz bo'lsa, bemalol so'rang. 🧘‍♀️" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        trackEvent({
            action: AnalyticsEvents.AI_CONCIERGE.MESSAGE_SENT,
            category: "AI",
            label: input.substring(0, 50),
        });

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input }),
            });
            const data = await res.json();

            if (data.answer) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: data.answer,
                    sources: data.sources
                }]);

                trackEvent({
                    action: AnalyticsEvents.AI_CONCIERGE.RESPONSE_RECEIVED,
                    category: "AI",
                    sources_count: data.sources?.length || 0,
                });
            } else {
                throw new Error(data.error || "Failed to get answer");
            }
        } catch (err: any) {
            setMessages(prev => [...prev, { role: "assistant", content: "Uzilish yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring. 🔄" }]);

            trackEvent({
                action: AnalyticsEvents.AI_CONCIERGE.ERROR,
                category: "AI",
                error: err.message || "Unknown",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white text-bm-fg">
            {/* Header */}
            <header className="p-4 border-b border-bm-border flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={() => router.back()} className="p-2 hover:bg-bm-surface rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-bm-fg" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bm-surface flex items-center justify-center border border-bm-border shadow-soft">
                        <Bot className="w-5 h-5 text-bm-fg" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xs font-black uppercase tracking-widest leading-none">AI Concierge</h1>
                        <span className="text-[9px] text-bm-success font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-bm-success rounded-full animate-pulse" />
                            Online
                        </span>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
            >
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] p-5 rounded-bm shadow-soft ${msg.role === 'user'
                                ? 'bg-bm-fg text-white rounded-tr-none'
                                : 'bg-white border border-bm-border rounded-tl-none ring-1 ring-bm-surface shadow-lg'
                                }`}>
                                <p className="text-xs whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>

                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-bm-border flex flex-wrap gap-2">
                                        <span className="text-[8px] text-bm-muted w-full font-black uppercase tracking-widest mb-1">Manbalar:</span>
                                        {msg.sources.map(s => (
                                            <Badge key={s.id} variant="outline" className="text-[8px] py-0">
                                                {s.title}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-bm-border p-4 rounded-bm rounded-tl-none flex items-center gap-3 shadow-soft">
                            <Loader2 className="w-4 h-4 animate-spin text-bm-muted" />
                            <span className="text-[10px] text-bm-muted font-black uppercase tracking-widest animate-pulse">O'ylayapman...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-bm-border pb-10">
                <div className="flex items-center gap-3 bg-bm-surface border border-bm-border rounded-bm p-1.5 focus-within:border-bm-fg/30 transition-all shadow-inner">
                    <input
                        type="text"
                        placeholder="Savolingizni yozing..."
                        className="flex-1 bg-transparent px-4 outline-none text-sm py-2 placeholder:text-bm-muted placeholder:font-medium font-medium"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        size="sm"
                        className="rounded-xl w-10 h-10 p-0 shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-[8px] text-center text-bm-muted mt-3 font-bold uppercase tracking-widest leading-relaxed">
                    AI xato qilishi mumkin. Muhim holatlarda trener bilan maslahatlashing.
                </p>
            </div>
        </div>
    );
}
