"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, Loader2, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

interface Message {
    id: string;
    text: string;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        role: string;
    };
}

export default function ChatRoomPage({ params }: { params: { roomId: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/chats/${params.roomId}/messages`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Fetch messages failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Polling for real-time feel
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [params.roomId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            const res = await fetch(`/api/chats/${params.roomId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newMessage }),
            });
            const data = await res.json();
            if (data.message) {
                setMessages((prev) => [...prev, data.message]);
                setNewMessage("");
            }
        } catch (err) {
            console.error("Send message failed:", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a2f1e] text-white overflow-hidden">
            {/* Header */}
            <header className="bg-[#0a2f1e]/80 backdrop-blur-lg border-b border-[#1a4d35] p-4 flex items-center gap-3 shrink-0">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors font-bold text-[#c9a86a]"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-lg leading-tight text-[#c9a86a]">Гуруҳ чати</h1>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Курсдошлар ва кураторлар билан</p>
                </div>
            </header>

            {/* Messages area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
            >
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-[#c9a86a]" />
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => {
                            const isMine = msg.user.id === user?.id;
                            const isTrainer = msg.user.role === "TRAINER" || msg.user.role === "ADMIN";

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                        {!isMine && (
                                            <span className={`text-[10px] font-bold ml-1 ${isTrainer ? "text-[#c9a86a]" : "text-gray-400"}`}>
                                                {msg.user.fullName} {isTrainer && "✨"}
                                            </span>
                                        )}
                                        <div className={`px-4 py-2 rounded-2xl text-sm shadow-md ${isMine
                                                ? "bg-[#c9a86a] text-[#0a2f1e] rounded-tr-none font-medium"
                                                : isTrainer
                                                    ? "bg-[#1a4d35] text-white border border-[#c9a86a]/30 rounded-tl-none"
                                                    : "bg-[#0d3d27] text-gray-200 border border-[#1a4d35] rounded-tl-none"
                                            }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[8px] text-gray-500 mx-1 mt-0.5">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Input area */}
            <div className="p-4 bg-[#0a2f1e] border-t border-[#1a4d35] safe-area-bottom">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Хабар ёзинг..."
                        className="flex-1 bg-[#0d3d27] border border-[#1a4d35] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a86a] transition-all placeholder:text-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${newMessage.trim() && !sending
                                ? "bg-[#c9a86a] text-[#0a2f1e] shadow-[0_0_15px_rgba(201,168,106,0.3)]"
                                : "bg-gray-800 text-gray-600"
                            }`}
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
