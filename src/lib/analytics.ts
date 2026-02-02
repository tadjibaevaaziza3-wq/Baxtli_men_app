"use client";

/**
 * Baxtli Men Universal Analytics Utility
 * Unified event tracking for GA4, Yandex Metrica, and Meta Pixel.
 */

type AnalyticsEventProps = {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
};

export const trackEvent = ({ action, category, label, value, ...props }: AnalyticsEventProps) => {
    // 1. Google Analytics (gtag)
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
            event_category: category,
            event_label: label,
            value: value,
            ...props,
        });
    }

    // 2. Yandex Metrica (ym)
    if (typeof window !== "undefined" && (window as any).ym) {
        const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
        if (metricaId) {
            (window as any).ym(metricaId, "params", {
                [action]: {
                    category,
                    label,
                    value,
                    ...props,
                },
            });
        }
    }

    // 3. Meta Pixel (fbq)
    if (typeof window !== "undefined" && (window as any).fbq) {
        // Map custom events to standard Pixel events if applicable, or use TrackCustom
        const standardEvents = ["PageView", "Contact", "Purchase", "Lead", "Schedule", "StartTrial"];
        if (standardEvents.includes(action)) {
            (window as any).fbq("track", action, { content_name: label, value, ...props });
        } else {
            (window as any).fbq("trackCustom", action, { category, label, value, ...props });
        }
    }

    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] Event Tracked: ${action}`, { category, label, value, ...props });
    }
};

export const AnalyticsEvents = {
    AI_CONCIERGE: {
        MESSAGE_SENT: "ai_message_sent",
        RESPONSE_RECEIVED: "ai_response_received",
        ERROR: "ai_error",
    },
    COURSE: {
        VIEW: "course_view",
        VIDEO_PLAY: "video_play",
        PURCHASE_CLICK: "purchase_click",
    },
    USER: {
        LOGIN: "user_login",
        AGREEMENT_ACCEPTED: "agreement_accepted",
    }
};
