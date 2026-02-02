const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`;

async function setWebhook() {
    if (!BOT_TOKEN) {
        console.error("TELEGRAM_BOT_TOKEN not found.");
        return;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Set Webhook Response:", data);
    } catch (err) {
        console.error("Failed to set webhook:", err);
    }
}

setWebhook();
