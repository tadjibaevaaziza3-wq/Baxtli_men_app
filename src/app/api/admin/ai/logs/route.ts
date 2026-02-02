import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const logs = await prisma.aiConversationLog.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(logs);
    } catch (err) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
