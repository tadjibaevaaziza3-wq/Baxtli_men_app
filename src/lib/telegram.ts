const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(telegramId: string | number | bigint, text: string, options: any = {}) {
    if (!BOT_TOKEN) {
        console.warn("TELEGRAM_BOT_TOKEN not found, skipping message.");
        return null;
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body = {
        chat_id: String(telegramId),
        text,
        parse_mode: "HTML",
        ...options
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!data.ok) {
            console.error("Telegram API Error:", data);
        }
        return data;
    } catch (err) {
        console.error("Failed to send Telegram message:", err);
        return null;
    }
}
