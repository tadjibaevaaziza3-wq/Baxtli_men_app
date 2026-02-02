import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ accepted: false });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const accepted = await prisma.agreementAcceptance.findFirst({
            where: { userId }
        });

        return NextResponse.json({ accepted: !!accepted });
    } catch (err) {
        return NextResponse.json({ accepted: false });
    }
}
