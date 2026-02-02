import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * Generates a 768-dimensional embedding for the given text.
 * Uses text-embedding-004 model.
 */
export async function getEmbedding(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text.replace(/\n/g, " "));
    return result.embedding.values;
}

/**
 * Basic generation wrapper for Gemini 1.5 Flash.
 */
export async function generateContent(prompt: string, systemInstruction?: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
}
