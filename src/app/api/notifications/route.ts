import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                status: { in: ["sent", "read"] }
            },
            orderBy: { sentAt: "desc" },
            take: 50
        });

        const unreadCount = await prisma.notification.count({
            where: { userId, status: "sent" }
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        // Mark all as read
        await prisma.notification.updateMany({
            where: { userId, status: "sent" },
            data: {
                status: "read",
                readAt: new Date()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark notifications read error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
