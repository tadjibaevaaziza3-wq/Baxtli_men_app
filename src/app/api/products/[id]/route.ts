import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                lessons: true
                            },
                            orderBy: { order: "asc" }
                        }
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Fetch product error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
