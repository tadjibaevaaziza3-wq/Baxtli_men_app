import crypto from "crypto";

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
}

interface ValidateResult {
    isValid: boolean;
    user?: TelegramUser;
}

/**
 * Validates 'initData' from Telegram Mini App.
 * Follows official security protocol: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramData(initData: string): ValidateResult {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables.");
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");
    urlParams.delete("hash");

    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

    // Create secret key
    const secretKey = crypto
        .createHmac("sha256", "WebAppData")
        .update(process.env.TELEGRAM_BOT_TOKEN)
        .digest();

    // Calculate HMAC-SHA256 hash
    const calculatedHash = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex");

    if (calculatedHash !== hash) {
        return { isValid: false };
    }

    const userString = urlParams.get("user");
    if (!userString) {
        return { isValid: false };
    }

    try {
        const user = JSON.parse(userString) as TelegramUser;
        return { isValid: true, user };
    } catch (e) {
        return { isValid: false };
    }
}
