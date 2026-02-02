import { NextRequest, NextResponse } from "next/server";
import { processSubscriptionJobs } from "@/lib/jobs";

export async function POST(req: NextRequest) {
    // In production, this should check for a CRON_SECRET header
    // const secret = req.headers.get("x-cron-secret");
    // if (secret !== process.env.CRON_SECRET) return new Response("Unauthorized", { status: 401 });

    try {
        const results = await processSubscriptionJobs();
        return NextResponse.json({ success: true, results });
    } catch (err) {
        console.error("Cron Handler Error:", err);
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
    }
}
