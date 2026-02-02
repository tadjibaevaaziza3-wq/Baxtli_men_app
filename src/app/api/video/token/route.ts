import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

// Cloudflare Stream Signing logic (Placeholder/Skeleton)
// You would use the Cloudflare API here to get a signed URL
async function getSignedStreamUrl(uid: string) {
    // CLOUDFLARE_ACCOUNT_ID and VIDEO_SIGNING_KEY are used to create the token
    return `https://customer-example.cloudflarestream.com/${uid}/iframe?token=TEMPORARY_SIGNED_TOKEN`;
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const lessonId = req.nextUrl.searchParams.get("lessonId");
        if (!lessonId) return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });

        // 1. Check Acceptance
        const accepted = await prisma.agreementAcceptance.findFirst({
            where: { userId }
        });
        if (!accepted) return NextResponse.json({ error: "AGREEMENT_REQUIRED" }, { status: 403 });

        // 2. Check Subscription
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: { include: { course: true } } }
        });

        if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

        const subscription = await prisma.subscription.findFirst({
            where: {
                userId,
                productId: lesson.module.course.product?.id,
                status: { in: ["ACTIVE", "EXPIRING"] },
                endDate: { gt: new Date() }
            }
        });

        if (!subscription && !lesson.isFreePreview) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // 3. Generate Signed URL
        const videoUid = lesson.videoProviderAssetId;
        if (!videoUid) return NextResponse.json({ error: "No video found" }, { status: 404 });

        const signedUrl = await getSignedStreamUrl(videoUid);

        return NextResponse.json({ signedUrl });
    } catch (err) {
        console.error("Video Sign Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
