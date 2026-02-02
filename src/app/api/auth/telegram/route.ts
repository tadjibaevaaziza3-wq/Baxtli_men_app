import { NextRequest, NextResponse } from "next/server";
import { validateTelegramData } from "@/lib/telegram-auth";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";
import { Role, UserSource } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function POST(req: NextRequest) {
    try {
        const { initData } = await req.json();

        if (!initData) {
            return NextResponse.json({ error: "Missing initData" }, { status: 400 });
        }

        const verification = validateTelegramData(initData);

        if (!verification.isValid || !verification.user) {
            return NextResponse.json({ error: "Invalid Telegram data" }, { status: 401 });
        }

        const { id: telegramId, first_name, last_name, username } = verification.user;

        // Upsert user in database
        const user = await prisma.user.upsert({
            where: { telegramId: BigInt(telegramId) },
            update: {
                username: username || null,
                fullName: `${first_name} ${last_name || ""}`.trim(),
            },
            create: {
                telegramId: BigInt(telegramId),
                username: username || null,
                fullName: `${first_name} ${last_name || ""}`.trim(),
                role: Role.CLIENT,
                source: UserSource.TELEGRAM,
            },
        });

        // Generate JWT
        const token = await new SignJWT({
            userId: user.id,
            role: user.role,
            telegramId: telegramId.toString()
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(JWT_SECRET);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                role: user.role,
                fullName: user.fullName
            }
        });

        // Set cookie for session management
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
