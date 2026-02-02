"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MessageSquare, Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";

interface ChatRoom {
    id: string;
    title: string;
    type: "COURSE" | "SUPPORT";
    lastMessage?: string;
}

export default function ChatsPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch("/api/chats/rooms");
                const data = await res.json();
                if (data.rooms) {
                    setRooms(data.rooms);
                }
            } catch (err) {
                console.error("Failed to fetch rooms:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a2f1e] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a2f1e]/80 backdrop-blur-lg border-b border-[#1a4d35] p-4 flex items-center justify-between">
                <button
                    onClick={() => router.push("/")}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-[#c9a86a]" />
                </button>
                <h1 className="text-xl font-bold text-[#c9a86a]">Чатларим</h1>
                <div className="w-10" />
            </header>

            <div className="p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#c9a86a] mb-4" />
                        <p className="text-gray-400">Чатлар юкланмоқда...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rooms.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 bg-[#0d3d27]/30 rounded-3xl border border-[#1a4d35]">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Ҳозирча чатлар йўқ.</p>
                                <p className="text-xs mt-2 italic">Курсларга аъзо бўлганингиздан сўнг чатлар очилади.</p>
                            </div>
                        ) : (
                            rooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => router.push(`/chats/${room.id}`)}
                                    className="p-5 rounded-2xl bg-[#0d3d27] border border-[#1a4d35] hover:border-[#c9a86a]/30 transition-all active:scale-[0.98] shadow-lg flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#c9a86a]/10 flex items-center justify-center text-[#c9a86a] shrink-0 group-hover:bg-[#c9a86a] group-hover:text-[#0a2f1e] transition-all">
                                        {room.type === "COURSE" ? <Users className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg leading-tight">{room.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Гуруҳ чати</p>
                                    </div>
                                    <span className="text-[#c9a86a] opacity-0 group-hover:opacity-100 transition-opacity">
                                        ➔
                                    </span>
                                </motion.div>
                            ))
                        )}

                        {/* Support Chat Static Option (Concept) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (rooms.length + 1) * 0.1 }}
                            onClick={() => alert("Техник ёрдам чати яқин кунларда ишга тушади! 🧘‍♀️")}
                            className="p-5 rounded-2xl bg-[#c9a86a]/5 border border-[#c9a86a]/20 flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#c9a86a]/20 flex items-center justify-center text-[#c9a86a] shrink-0">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg leading-tight">Қўллаб-қувватлаш</h3>
                                <p className="text-xs text-[#c9a86a]/60 mt-1">Савол ва таклифлар учун</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
