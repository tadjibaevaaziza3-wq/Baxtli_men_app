import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const docs = await prisma.aiKnowledgeDoc.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(docs);
    } catch (err) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
