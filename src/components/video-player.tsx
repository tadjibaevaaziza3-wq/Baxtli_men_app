"use client";

import { useEffect, useState, useRef } from "react";
import { Stream } from "@cloudflare/stream-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

interface VideoPlayerProps {
    lessonId?: string;
    initialSrc?: string;
}

export function VideoPlayer({ lessonId, initialSrc }: VideoPlayerProps) {
    const { user } = useAuth();
    const [videoSrc, setVideoSrc] = useState(initialSrc || "");
    const [loading, setLoading] = useState(!!lessonId && !initialSrc);
    const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 10 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch Signed Token
    useEffect(() => {
        if (!lessonId) return;

        const fetchToken = async () => {
            try {
                const res = await fetch(`/api/video/token?lessonId=${lessonId}`);
                const data = await res.json();
                if (data.signedUrl) {
                    setVideoSrc(data.signedUrl);
                }
            } catch (err) {
                console.error("Token fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchToken();
    }, [lessonId]);

    // Dynamic Watermark Movement
    useEffect(() => {
        const interval = setInterval(() => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setWatermarkPos({
                    x: Math.random() * (width - 150),
                    y: Math.random() * (height - 50),
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const watermarkText = user
        ? `${user.fullName} (${user.id})`
        : "Baxtli Men Platform";

    return (
        <div ref={containerRef} className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#1a4d35] shadow-2xl group flex items-center justify-center">
            {loading ? (
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#c9a86a] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-[#c9a86a] uppercase font-bold tracking-widest">Securing content...</span>
                </div>
            ) : videoSrc ? (
                <Stream
                    src={videoSrc}
                    controls
                    responsive={false}
                    className="w-full h-full"
                />
            ) : (
                <div className="text-red-500 text-xs font-bold">Video mavjud emas</div>
            )}

            {/* Dynamic Watermark Overlay */}
            <motion.div
                animate={{ x: watermarkPos.x, y: watermarkPos.y }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute pointer-events-none select-none z-10"
            >
                <div className="bg-black/20 backdrop-blur-[1px] px-2 py-0.5 rounded text-[8px] md:text-[10px] text-white/10 font-mono rotate-[-15deg]">
                    {watermarkText}
                </div>
            </motion.div>

            {/* Premium Protective Overlay (Subtle Gradient) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
