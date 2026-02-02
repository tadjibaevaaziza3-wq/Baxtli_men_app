import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { roomId } = await params;

        const messages = await prisma.chatMessage.findMany({
            where: { roomId, isDeleted: false },
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true
                    }
                }
            },
            take: 100 // Limit history for now
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Fetch messages error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;
        const { roomId } = await params;
        const { text } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
        }

        // Verify user has access to this room (simplified for now, should check enrollment)
        const room = await prisma.courseChatRoom.findUnique({ where: { id: roomId } });
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

        const message = await prisma.chatMessage.create({
            data: {
                roomId,
                userId,
                text: text.trim(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({ message });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;
        const userRole = payload.role as string;
        const { searchParams } = new URL(req.url);
        const messageId = searchParams.get("messageId");

        if (!messageId) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        const message = await prisma.chatMessage.findUnique({
            where: { id: messageId },
            select: { userId: true }
        });

        if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

        // Allow delete if Admin or Owner
        if (userRole !== "ADMIN" && message.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                isDeleted: true,
                deletedByAdminId: userRole === "ADMIN" ? userId : undefined
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete message error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
