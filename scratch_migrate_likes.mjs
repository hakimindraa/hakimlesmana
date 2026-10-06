import { neon } from "@neondatabase/serverless";

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);
  
  try {
    console.log("Starting migration to add likes_count...");
    await sql`ALTER TABLE blogs ADD COLUMN likes_count INTEGER DEFAULT 0`;
    console.log("Migration successful: Added likes_count");
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      console.log("Column already exists.");
    } else {
      console.error("Migration failed:", err);
    }
  }
}

migrate();
