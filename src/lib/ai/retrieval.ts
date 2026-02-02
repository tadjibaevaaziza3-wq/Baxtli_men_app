import { prisma } from "@/lib/prisma";
import { getEmbedding } from "./gemini";

interface SearchResult {
    id: string;
    title: string;
    contentText: string;
    score: number;
}

/**
 * Searches the AiKnowledgeDoc table for relevant context using pgvector.
 * Returns top-k matches filtered by language and status.
 */
export async function retrieveContext(
    queryText: string,
    options: {
        limit?: number;
        language?: string;
        courseId?: string;
        minStatus?: "DRAFT" | "APPROVED" | "GOLD"
    } = {}
): Promise<SearchResult[]> {
    const { limit = 5, language = "uz", courseId, minStatus = "APPROVED" } = options;

    const queryEmbedding = await getEmbedding(queryText);

    // Convert embedding array to Postgres vector string format '[0.1, 0.2, ...]'
    const vectorStr = `[${queryEmbedding.join(",")}]`;

    // We use raw SQL because Prisma doesn't natively support vector similarity operators yet.
    // Using cosine distance (<=> operator in pgvector). 
    // Lower distance means higher similarity.
    const results = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      id, 
      title, 
      "contentText", 
      status,
      (embedding <=> CAST('${vectorStr}' AS vector)) as distance
    FROM "AiKnowledgeDoc"
    WHERE status IN ('APPROVED', 'GOLD')
      AND language = $1
      ${courseId ? 'AND "courseId" = $2' : ''}
    ORDER BY (CASE WHEN status = 'GOLD' THEN 0 ELSE 1 END), distance ASC
    LIMIT $3;
  `, language, ...(courseId ? [courseId] : []), limit);

    return results.map(r => ({
        id: r.id,
        title: r.title,
        contentText: r.contentText,
        score: 1 - r.distance // Approximate similarity score
    }));
}
