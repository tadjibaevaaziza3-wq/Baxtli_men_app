import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const CLICK_SERVICE_ID = process.env.CLICK_SERVICE_ID;
const CLICK_MERCHANT_ID = process.env.CLICK_MERCHANT_ID;
const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const data = Object.fromEntries(formData.entries());

        // 1. Validate Signature
        const {
            click_trans_id,
            service_id,
            click_paydoc_id,
            merchant_trans_id, // This is our Order ID
            amount,
            action,
            error,
            error_note,
            sign_time,
            sign_string,
        } = data as any;

        const mySignString = crypto
            .createHash("md5")
            .update(
                `${click_trans_id}${service_id}${CLICK_SECRET_KEY}${merchant_trans_id}${amount}${action}${sign_time}`
            )
            .digest("hex");

        if (sign_string !== mySignString) {
            return NextResponse.json({ error: -1, error_note: "SIGN CHECK FAILED" });
        }

        // 2. Load Order
        const order = await prisma.order.findUnique({
            where: { id: merchant_trans_id },
            include: { product: true },
        });

        if (!order) {
            return NextResponse.json({ error: -5, error_note: "ORDER NOT FOUND" });
        }

        if (parseFloat(amount) !== order.amountUzs) {
            return NextResponse.json({ error: -2, error_note: "INCORRECT AMOUNT" });
        }

        // 3. Handle Actions
        if (parseInt(action) === 0) { // PREPARE
            if (order.status === "PAID") {
                return NextResponse.json({ error: -4, error_note: "ALREADY PAID" });
            }
            return NextResponse.json({
                click_trans_id,
                merchant_trans_id,
                merchant_prepare_id: order.id,
                error: 0,
                error_note: "Success",
            });
        }

        if (parseInt(action) === 1) { // COMPLETE
            if (parseInt(error) < 0) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: "FAILED" },
                });
                return NextResponse.json({ error, error_note });
            }

            if (order.status === "PAID") {
                return NextResponse.json({
                    click_trans_id,
                    merchant_trans_id,
                    merchant_confirm_id: order.id,
                    error: 0,
                    error_note: "Already paid",
                });
            }

            // TRANSACTION: Update Order + Create Payment + Open Access
            await prisma.$transaction(async (tx) => {
                await tx.order.update({
                    where: { id: order.id },
                    data: { status: "PAID" },
                });

                await tx.payment.create({
                    data: {
                        orderId: order.id,
                        provider: "click",
                        transactionId: click_trans_id,
                        status: "PAID",
                        paidAt: new Date(),
                        payload: data,
                    },
                });

                // Open Access (Subscription)
                const durationDays = order.product.durationDays || 30;
                await tx.subscription.create({
                    data: {
                        userId: order.userId,
                        productId: order.productId,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
                        status: "ACTIVE",
                    },
                });
            });

            return NextResponse.json({
                click_trans_id,
                merchant_trans_id,
                merchant_confirm_id: order.id,
                error: 0,
                error_note: "Success",
            });
        }

        return NextResponse.json({ error: -3, error_note: "ACTION NOT FOUND" });
    } catch (err) {
        console.error("Click Callback Error:", err);
        return NextResponse.json({ error: -9, error_note: "INTERNAL ERROR" });
    }
}
