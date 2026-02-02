"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
    id: string;
    role: string;
    fullName: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (initData: string) => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/telegram", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ initData }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Authentication failed");
            }

            setUser(data.user);
        } catch (err: any) {
            setError(err.message);
            console.error("Auth hook error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Check if we are in Telegram environment
        if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
            const tg = (window as any).Telegram.WebApp;
            tg.ready();

            if (tg.initData) {
                login(tg.initData);
            } else {
                // Local development mode or not in Telegram
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [login]);

    return { user, loading, error, login };
}
