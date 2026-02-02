import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

/**
 * Telegram Webhook Handler
 * Handles:
 * 1. Admin marking messages for Knowledge Base
 * 2. Automated welcome messages in TG chats
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Simple verification (in production use a secret in the URL)
        // const secret = req.nextUrl.searchParams.get("secret");
        // if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) ...

        if (body.message && body.message.text === "/start") {
            await sendTelegramMessage(body.message.chat.id, "Baxtli Men Botiga xush kelibsiz! 🧘‍♀️");
            return NextResponse.json({ ok: true });
        }

        // "Add to KB" Logic via Reply Command
        // Usage: Admin replies to a trainer message with "/addkb"
        if (body.message && body.message.text === "/addkb" && body.message.reply_to_message) {
            const adminId = body.message.from.id;
            const msgToIngest = body.message.reply_to_message;

            // Verify if sender is Admin/Trainer in our DB
            const user = await prisma.user.findUnique({
                where: { telegramId: BigInt(adminId) }
            });

            if (!user || (user.role !== "ADMIN" && user.role !== "TRAINER")) {
                await sendTelegramMessage(body.message.chat.id, "Kechirasiz, sizda ushbu amal uchun huquq yo'q. 🚫");
                return NextResponse.json({ ok: true });
            }

            // Send to Ingestion API internal call (logic reuse)
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/ai/ingest/tg-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: msgToIngest.text,
                    firstName: msgToIngest.from?.first_name,
                    username: msgToIngest.from?.username,
                    telegramId: String(msgToIngest.from?.id),
                    tags: ["telegram_chat_manual"]
                })
            });

            if (res.ok) {
                await sendTelegramMessage(body.message.chat.id, "Xabar AI bilimlar bazasiga (DRAFT) qo'shildi! ✅\nAdmin panelda tasdiqlashni unutmang.");
            } else {
                await sendTelegramMessage(body.message.chat.id, "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring. ❌");
            }
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Webhook Error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
