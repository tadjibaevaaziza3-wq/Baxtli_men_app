import { prisma } from "./prisma";
import { sendTelegramMessage } from "./telegram";

export async function processSubscriptionJobs() {
    const results = {
        notified: 0,
        expired: 0,
        errors: [] as string[]
    };

    try {
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        // 1. Notify Expiring (3 days left)
        const expiring = await prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
                notify3dSent: false,
                endDate: {
                    lte: threeDaysFromNow,
                    gt: now
                }
            },
            include: { user: true, product: true }
        });

        for (const sub of expiring) {
            try {
                if (sub.user.telegramId) {
                    const msg = `<b>Ҳурматли ${sub.user.fullName}!</b>\n\nСизнинг "${sub.product.title}" курсига бўлган обунангиз 3 кундан сўнг тугайди. Обунани давом эттириш учун иловадаги 'Сотиб олиш' бўлимига ўтинг.\n\n--- \n<i>Ваш доступ к курсу "${sub.product.title}" истекает через 3 дня.</i>`;
                    await sendTelegramMessage(sub.user.telegramId, msg);
                }

                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: {
                        status: "EXPIRING",
                        notify3dSent: true,
                        lastNotifiedAt: now
                    }
                });
                results.notified++;
            } catch (e: any) {
                results.errors.push(`Notify error (${sub.id}): ${e.message}`);
            }
        }

        // 2. Disable Expired
        const expired = await prisma.subscription.findMany({
            where: {
                status: { in: ["ACTIVE", "EXPIRING"] },
                endDate: { lte: now },
                manualOverride: false
            },
            include: { user: true, product: true }
        });

        for (const sub of expired) {
            try {
                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: { status: "EXPIRED" }
                });

                if (sub.user.telegramId) {
                    const msg = `<b>Обуна тугади.</b>\n\n"${sub.product.title}" курсига бўлган доступингиз вақти тугагани сабабли ёпилди. Давом эттириш учун қайта харид қилинг.\n\n--- \n<i>Срок действия подписки на курс "${sub.product.title}" окончен.</i>`;
                    await sendTelegramMessage(sub.user.telegramId, msg);
                }
                results.expired++;
            } catch (e: any) {
                results.errors.push(`Expiry error (${sub.id}): ${e.message}`);
            }
        }

        // 3. Log Job
        await prisma.systemJobLog.create({
            data: {
                jobName: "subscription-lifecycle",
                status: results.errors.length === 0 ? "success" : "partial_fail",
                processedCount: results.notified + results.expired,
                errorsJson: results.errors,
                finishedAt: new Date()
            }
        });

    } catch (err: any) {
        console.error("Job Runner Error:", err);
        results.errors.push(err.message);
    }

    return results;
}
