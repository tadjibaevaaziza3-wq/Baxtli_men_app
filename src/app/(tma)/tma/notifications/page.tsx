"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, BellOff, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    title: string;
    body: string;
    status: string;
    sentAt: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await fetch("/api/notifications", { method: "PATCH" });
            setNotifications(prev => prev.map(n => ({ ...n, status: "read" })));
        } catch (err) {
            console.error("Failed to mark read:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Mark as read after 2 seconds of viewing
        const timer = setTimeout(markAllRead, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a2f1e] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a2f1e]/80 backdrop-blur-lg border-b border-[#1a4d35] p-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-[#c9a86a]" />
                </button>
                <h1 className="text-xl font-bold text-[#c9a86a]">Билдиришномалар</h1>
                <div className="w-10" />
            </header>

            <div className="p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#c9a86a] mb-4" />
                        <p className="text-gray-400">Юкланмоқда...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 bg-[#0d3d27]/30 rounded-3xl border border-[#1a4d35]">
                                <BellOff className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Ҳозирча билдиришномалар йўқ.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {notifications.map((n, index) => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-4 rounded-2xl border transition-all ${n.status === "sent"
                                                ? "bg-[#c9a86a]/10 border-[#c9a86a]/30 shadow-[0_0_15px_rgba(201,168,106,0.1)]"
                                                : "bg-[#0d3d27] border-[#1a4d35]"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`font-bold ${n.status === "sent" ? "text-[#c9a86a]" : "text-white"}`}>
                                                {n.title}
                                            </h3>
                                            <span className="text-[8px] text-gray-500 uppercase">
                                                {new Date(n.sentAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {n.body}
                                        </p>
                                        {n.status === "sent" && (
                                            <div className="mt-2 flex justify-end">
                                                <span className="text-[10px] font-bold text-[#c9a86a] flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Янги
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
