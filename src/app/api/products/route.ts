import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isPublished: true,
                isDeleted: false,
            },
            orderBy: {
                priceUzs: "asc",
            },
            select: {
                id: true,
                title: true,
                description: true,
                priceUzs: true,
                type: true,
                durationDays: true,
            }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Products fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
