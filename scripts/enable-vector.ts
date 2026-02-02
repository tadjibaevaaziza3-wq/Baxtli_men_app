import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;

async function enableVector() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL not found");
        return;
    }

    const pool = new Pool({ connectionString });

    try {
        console.log("Enabling pgvector extension...");
        await pool.query("CREATE EXTENSION IF NOT EXISTS vector;");
        console.log("Extension enabled successfully.");
    } catch (err) {
        console.error("Failed to enable pgvector:", err);
    } finally {
        await pool.end();
    }
}

enableVector();
