import { neon } from '@neondatabase/serverless';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  
  try {
    console.log("Adding image_url column to blogs table...");
    await sql`ALTER TABLE blogs ADD COLUMN image_url TEXT;`;
    console.log("Migration successful!");
  } catch (error) {
    if (error.code === '42701') {
      console.log("Column image_url already exists. Skipping.");
    } else {
      console.error("Migration failed:", error);
    }
  }
}

runMigration();
