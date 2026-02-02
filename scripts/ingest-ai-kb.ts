import { prisma } from "../src/lib/prisma";
import { getEmbedding } from "../src/lib/ai/gemini";
import { redactPII } from "../src/lib/ai/redactor";

async function ingestInitialKnowledge() {
    console.log("Starting knowledge ingestion...");

    try {
        // 1. Fetch all published products with courses
        const products = await prisma.product.findMany({
            where: { isDeleted: false, isPublished: true },
            include: {
                course: {
                    include: {
                        modules: { include: { lessons: true } }
                    }
                }
            }
        });

        for (const p of products) {
            console.log(`Processing product: ${p.title}`);

            // High-priority GOLD document for the main product info
            await upsertKnowledgeDoc({
                title: p.title,
                contentText: redactPII(p.description),
                courseId: p.courseId,
                sourceType: "COURSE" as any,
                status: "GOLD" as any,
                language: "uz",
                tags: ["product_info", "official"]
            });

            if (p.course) {
                for (const m of p.course.modules) {
                    for (const l of m.lessons) {
                        await upsertKnowledgeDoc({
                            title: `${p.title}: ${l.title}`,
                            contentText: redactPII(`Курс: ${p.title}. Модуль: ${m.title}. Мавзу: ${l.title}.`),
                            courseId: p.courseId,
                            sourceType: "COURSE" as any,
                            status: "APPROVED" as any,
                            language: "uz",
                            tags: ["lesson_content"]
                        });
                    }
                }
            }
        }

        console.log("Ingestion finished.");
    } catch (err) {
        console.error(err);
    }
}

async function upsertKnowledgeDoc(doc: any) {
    const embedding = await getEmbedding(doc.contentText);
    const created = await prisma.aiKnowledgeDoc.create({
        data: {
            title: doc.title,
            contentText: doc.contentText,
            courseId: doc.courseId,
            sourceType: doc.sourceType,
            status: doc.status,
            language: doc.language,
            tags: doc.tags,
        }
    });

    const vectorStr = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
        `UPDATE "AiKnowledgeDoc" SET embedding = CAST('${vectorStr}' AS vector) WHERE id = $1`,
        created.id
    );
}

ingestInitialKnowledge();
