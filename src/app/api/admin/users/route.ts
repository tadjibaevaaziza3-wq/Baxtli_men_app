import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            include: {
                subscriptions: {
                    select: { id: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
