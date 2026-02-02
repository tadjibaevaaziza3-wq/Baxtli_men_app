import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const { version } = await req.json();

        await prisma.agreementAcceptance.create({
            data: {
                userId,
                version: version || "1.0",
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Accept Agreement Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
