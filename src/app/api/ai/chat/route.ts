import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { generateContent } from "@/lib/ai/gemini";
import { retrieveContext } from "@/lib/ai/retrieval";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
);

const SYSTEM_PROMPT = `
Сиз "Baxtli Men" платформасининг AI-ёрдамчисисиз. Сизнинг вазифангиз фойдаланувчиларга йога, соғлом турмуш тарзи ва платформадаги курслар бўйича ёрдам бериш.

ҚОИДАЛАР:
1. Фақат берилган КОНТЕКСТ асосида жавоб беринг. Агар жавоб контекстда бўлмаса, хушмуомалалик билан "Кечирасиз, бу борада маълумотим кам. Тренеримиз @Sabina_Polatova га мурожаат қилишни маслаҳат бераман" деб жавоб беринг.
2. ТИББИЙ ДИАГНОЗ ва медицина тавсияларини берманг.
3. Оҳангинг хушмуомала, руҳлантирувчи ва профессионал бўлиши керак.
4. Жавоб охирида фойдаланилган манбаларни (Sources) JSON форматида кўрсатилганидек илова қилинг.
5. Агар савол муайян курсга оид бўлса, уни сотиб олишни ёки очишни тавсия қилинг.

КОНТЕКСТ:
{context}
`;

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const { question, language = "uz", courseId } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        // 1. Retrieve Context
        const contextResults = await retrieveContext(question, {
            language,
            courseId,
            limit: 3
        });

        const contextText = contextResults.map(r => `[ID: ${r.id}, Title: ${r.title}] ${r.contentText}`).join("\n\n");

        // 2. Format Prompt
        const fullPrompt = `Фойдаланувчи саволи: ${question}\n\nКонтекст асосида жавоб беринг.`;
        const systemWithContext = SYSTEM_PROMPT.replace("{context}", contextText || "Ҳозирча бу мавзуда маълумот йўқ.");

        // 3. Generate Answer
        const answer = await generateContent(fullPrompt, systemWithContext);

        // 4. Log Conversation
        await prisma.aiConversationLog.create({
            data: {
                userId,
                question,
                answer,
                sourcesJson: contextResults.map(r => ({ id: r.id, title: r.title }))
            }
        });

        return NextResponse.json({
            answer,
            sources: contextResults.map(r => ({ id: r.id, title: r.title }))
        });

    } catch (err) {
        console.error("AI Chat API Error:", err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
