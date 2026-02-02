"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationBell() {
    const router = useRouter();
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (typeof data.unreadCount === "number") {
                setUnreadCount(data.unreadCount);
            }
        } catch (err) {
            console.error("Failed to fetch notification count:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <button
            onClick={() => router.push("/notifications")}
            className="p-2 relative hover:bg-white/5 rounded-full transition-colors group"
        >
            <Bell className="w-6 h-6 text-[#c9a86a] group-hover:scale-110 transition-transform" />
            <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a2f1e]"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
