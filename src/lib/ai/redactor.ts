/**
 * Redacts PII (Personally Identifiable Information) from text 
 * to ensure user privacy in the AI knowledge base.
 */
export function redactPII(text: string): string {
    let redacted = text;

    // Redact Phone Numbers (Basic pattern for UZ/Intl)
    redacted = redacted.replace(/(\+?\d{1,3})?[\s-]?\(?\d{2,3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g, "[PHONE]");

    // Redact Emails
    redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL]");

    // Redact exact address-like patterns (e.g. ko'chasi, kvartal)
    redacted = redacted.replace(/(?:ko'chasi|kvartal|uy|kv)\.?\s*\d+/gi, "[ADDRESS]");

    return redacted;
}
