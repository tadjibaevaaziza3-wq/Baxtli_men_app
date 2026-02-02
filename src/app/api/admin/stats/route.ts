import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // 1. Total Users
        const totalUsers = await prisma.user.count();

        // 2. New Users 7d
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers7d = await prisma.user.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        // 3. Active Subscriptions
        const now = new Date();
        const activeSubs = await prisma.subscription.count({
            where: {
                status: { in: ["ACTIVE", "EXPIRING"] },
                endDate: { gt: now }
            }
        });

        // 4. Expiring in 3 days
        const in3Days = new Date();
        in3Days.setDate(in3Days.getDate() + 3);
        const expiring3d = await prisma.subscription.count({
            where: {
                status: { in: ["ACTIVE", "EXPIRING"] },
                endDate: {
                    gt: now,
                    lte: in3Days
                }
            }
        });

        // 5. Expired Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const expiredToday = await prisma.subscription.count({
            where: {
                status: "EXPIRED",
                updatedAt: { gte: startOfToday }
            }
        });

        const expiringSoon = await prisma.subscription.findMany({
            where: {
                status: { in: ["ACTIVE", "EXPIRING"] },
                endDate: {
                    gt: now,
                    lte: in3Days
                }
            },
            include: { user: true, product: true },
            take: 10,
            orderBy: { endDate: "asc" }
        });

        // 6. Revenue 30d
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const payments30d = await prisma.payment.findMany({
            where: {
                status: "PAID",
                paidAt: { gte: thirtyDaysAgo }
            },
            select: { order: { select: { amountUzs: true } } }
        });

        const revenue30d = payments30d.reduce((sum: number, p: any) => sum + (p.order?.amountUzs || 0), 0);
        const paymentsCount30d = payments30d.length;

        return NextResponse.json({
            totalUsers,
            newUsers7d,
            activeSubs,
            expiring3d,
            expiredToday,
            revenue30d,
            paymentsCount30d
        });
    } catch (err) {
        console.error("Dashboard Stats API Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
