import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { action } = await req.json();
        const { id: subId } = await params;

        const sub = await prisma.subscription.findUnique({
            where: { id: subId },
            include: { user: true }
        });

        if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

        if (action === "extend") {
            const newEndDate = new Date(sub.endDate);
            newEndDate.setDate(newEndDate.getDate() + 30); // Extend by 30 days

            await prisma.subscription.update({
                where: { id: subId },
                data: {
                    endDate: newEndDate,
                    status: "ACTIVE",
                    manualOverride: true,
                    notify3dSent: false // Reset notification for next cycle
                }
            });

            // Log action
            await prisma.adminAuditLog.create({
                data: {
                    adminId: "SYSTEM_ADMIN", // In real app, get from auth
                    action: "EXTEND_SUBSCRIPTION",
                    targetType: "SUBSCRIPTION",
                    targetId: subId,
                    metadataJson: { oldEndDate: sub.endDate, newEndDate }
                }
            });
        }

        if (action === "revoke") {
            await prisma.subscription.update({
                where: { id: subId },
                data: {
                    status: "EXPIRED",
                    manualOverride: true
                }
            });

            await prisma.adminAuditLog.create({
                data: {
                    adminId: "SYSTEM_ADMIN",
                    action: "REVOKE_SUBSCRIPTION",
                    targetType: "SUBSCRIPTION",
                    targetId: subId,
                    metadataJson: { endDate: sub.endDate }
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Subscription Action Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
