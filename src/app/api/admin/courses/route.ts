import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isDeleted: false },
            include: {
                course: {
                    include: {
                        modules: {
                            include: { lessons: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
