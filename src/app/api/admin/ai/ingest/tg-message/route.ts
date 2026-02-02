import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redactPII } from "@/lib/ai/redactor";

export async function POST(req: NextRequest) {
    try {
        // In production, verify secret from bot
        const { text, username, firstName, telegramId, tags, language = "uz", courseId } = await req.json();

        if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

        const redactedText = redactPII(text);

        const doc = await prisma.aiKnowledgeDoc.create({
            data: {
                title: `TG Message from ${firstName || username || telegramId}`,
                contentText: redactedText,
                sourceType: "TRAINER_CHAT",
                status: "DRAFT",
                language,
                tags: tags || ["telegram_chat"],
                courseId
            }
        });

        return NextResponse.json({ success: true, docId: doc.id });
    } catch (err) {
        console.error("TG Ingestion Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
