import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

/**
 * API to generate a signed playback token for Cloudflare Stream.
 * Documentation: https://developers.cloudflare.com/stream/viewing-videos/securing-video-playback/
 */
export async function POST(req: NextRequest) {
    try {
        const { videoId } = await req.json();
        const token = req.cookies.get("auth_token")?.value;

        if (!token || !videoId) {
            return NextResponse.json({ error: "Unauthorized or missing videoId" }, { status: 401 });
        }

        // 1. Verify User Session
        let userId;
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            userId = payload.userId;
        } catch (e) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        // 2. TODO: Check if user has access to this video/product in DB
        // const hasAccess = await prisma.order.findFirst(...)
        const hasAccess = true; // Temporary mock

        if (!hasAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // 3. Generate Cloudflare Signed Token
        // Note: This requires CLOUDFLARE_STREAM_KEY and CLOUDFLARE_STREAM_KEY_ID
        // For now, we return the plain ID for development until keys are provided.

        if (!process.env.CLOUDFLARE_STREAM_KEY) {
            return NextResponse.json({
                playbackUrl: videoId, // In dev, we use raw ID
                warning: "Production signing keys missing. Using raw UID."
            });
        }

        // Production logic would go here:
        // const signedToken = await signCloudflareToken(videoId, process.env.CLOUDFLARE_STREAM_KEY);
        // return NextResponse.json({ playbackUrl: signedToken });

        return NextResponse.json({ playbackUrl: videoId });
    } catch (error) {
        console.error("Video signing error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
