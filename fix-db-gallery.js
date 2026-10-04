const fs = require('fs');
const { neon } = require('@neondatabase/serverless');

function parseEnv() {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    if (line.startsWith('DATABASE_URL=')) {
      return line.split('=')[1].trim().replace(/"/g, '');
    }
  }
}

async function fixDb() {
  const dbUrl = parseEnv();
  if (!dbUrl) {
    console.error("DATABASE_URL not found");
    return;
  }
  const sql = neon(dbUrl);
  console.log("Adding is_published column to photos table...");
  
  try {
    await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true`;
    console.log("Column is_published added successfully!");
    
    // Ensure all existing rows are set to true just in case
    await sql`UPDATE photos SET is_published = true WHERE is_published IS NULL`;
    console.log("Existing rows updated to is_published = true!");
  } catch (err) {
    console.error("Error updating table:", err);
  }
}

fixDb();
