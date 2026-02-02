import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYME_MERCHANT_ID = process.env.PAYME_MERCHANT_ID;
const PAYME_SECRET_KEY = process.env.PAYME_SECRET_KEY;

// Payme Error Codes
const ERROR_INVALID_AMOUNT = -31001;
const ERROR_TRANSACTION_NOT_FOUND = -31003;
const ERROR_ORDER_NOT_FOUND = -31050;
const ERROR_ALREADY_PAID = -31051;
const ERROR_CANCELED = -31007;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return errorResponse(-32504, "Permission denied");
        }

        const auth = Buffer.from(authHeader.split(" ")[1], "base64").toString();
        const [user, key] = auth.split(":");
        if (user !== "Paycom" || key !== PAYME_SECRET_KEY) {
            return errorResponse(-32504, "Permission denied");
        }

        const { method, params, id } = await req.json();

        switch (method) {
            case "CheckPerformTransaction":
                return await handleCheckPerform(params, id);
            case "CreateTransaction":
                return await handleCreateTransaction(params, id);
            case "PerformTransaction":
                return await handlePerformTransaction(params, id);
            case "CancelTransaction":
                return await handleCancelTransaction(params, id);
            case "CheckTransaction":
                return await handleCheckTransaction(params, id);
            default:
                return errorResponse(-32601, "Method not found", id);
        }
    } catch (err) {
        console.error("Payme Callback Error:", err);
        return errorResponse(-32400, "Parse error");
    }
}

async function handleCheckPerform(params: any, id: any) {
    const orderId = params.account.order_id;
    const amount = params.amount / 100; // Payme sends in tiyin

    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order) return errorResponse(ERROR_ORDER_NOT_FOUND, "Order not found", id);
    if (order.status === "PAID") return errorResponse(ERROR_ALREADY_PAID, "Already paid", id);
    if (order.amountUzs !== amount) return errorResponse(ERROR_INVALID_AMOUNT, "Invalid amount", id);

    return NextResponse.json({ result: { allow: true }, id });
}

async function handleCreateTransaction(params: any, id: any) {
    const orderId = params.account.order_id;
    const transId = params.id;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return errorResponse(ERROR_ORDER_NOT_FOUND, "Order not found", id);

    const existing = await prisma.payment.findUnique({ where: { transactionId: transId } });
    if (existing) {
        if (existing.status !== "PENDING") return errorResponse(-31008, "Transaction state invalid", id);
        return NextResponse.json({
            result: {
                create_time: existing.createdAt.getTime(),
                transaction: existing.id,
                state: 1
            },
            id
        });
    }

    // Check if order already has another pending/paid payment
    const other = await prisma.payment.findFirst({
        where: { orderId: order.id, status: { in: ["PENDING", "PAID"] } }
    });
    if (other) return errorResponse(-31099, "Other transaction in progress", id);

    const payment = await prisma.payment.create({
        data: {
            orderId: order.id,
            provider: "payme",
            transactionId: transId,
            status: "PENDING",
            payload: params
        }
    });

    return NextResponse.json({
        result: {
            create_time: payment.createdAt.getTime(),
            transaction: payment.id,
            state: 1
        },
        id
    });
}

async function handlePerformTransaction(params: any, id: any) {
    const transId = params.id;
    const payment = await prisma.payment.findUnique({
        where: { transactionId: transId },
        include: { order: { include: { product: true } } }
    });

    if (!payment) return errorResponse(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found", id);

    if (payment.status === "PAID") {
        return NextResponse.json({
            result: {
                transaction: payment.id,
                perform_time: payment.paidAt?.getTime(),
                state: 2
            },
            id
        });
    }

    if (payment.status !== "PENDING") return errorResponse(-31008, "Invalid state", id);

    const paidAt = new Date();
    await prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: { id: payment.id },
            data: { status: "PAID", paidAt }
        });
        await tx.order.update({
            where: { id: payment.orderId },
            data: { status: "PAID" }
        });

        // Open Access
        const durationDays = payment.order.product.durationDays || 30;
        await tx.subscription.create({
            data: {
                userId: payment.order.userId,
                productId: payment.order.productId,
                startDate: new Date(),
                endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
                status: "ACTIVE",
            },
        });
    });

    return NextResponse.json({
        result: {
            transaction: payment.id,
            perform_time: paidAt.getTime(),
            state: 2
        },
        id
    });
}

async function handleCancelTransaction(params: any, id: any) {
    const transId = params.id;
    const payment = await prisma.payment.findUnique({ where: { transactionId: transId } });
    if (!payment) return errorResponse(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found", id);

    if (payment.status === "CANCELED") {
        return NextResponse.json({
            result: { transaction: payment.id, cancel_time: payment.updatedAt.getTime(), state: -1 },
            id
        });
    }

    // Logic for Revoking access if PAID but canceled?
    // Usually Payme doesn't cancel after Perform, but we should handle it if reason 5 (refund).

    await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "CANCELED" }
    });

    return NextResponse.json({
        result: { transaction: payment.id, cancel_time: Date.now(), state: -1 },
        id
    });
}

async function handleCheckTransaction(params: any, id: any) {
    const transId = params.id;
    const payment = await prisma.payment.findUnique({ where: { transactionId: transId } });
    if (!payment) return errorResponse(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found", id);

    return NextResponse.json({
        result: {
            create_time: payment.createdAt.getTime(),
            perform_time: payment.paidAt?.getTime() || 0,
            cancel_time: payment.status === "CANCELED" ? payment.updatedAt.getTime() : 0,
            transaction: payment.id,
            state: payment.status === "PAID" ? 2 : payment.status === "PENDING" ? 1 : -1,
            reason: null
        },
        id
    });
}

function errorResponse(code: number, message: string, id: any = null) {
    return NextResponse.json({ error: { code, message }, id });
}
