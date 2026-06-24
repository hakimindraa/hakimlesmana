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
  try {
    const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'profile'`;
    const colNames = cols.map(c => c.column_name);

    if (!colNames.includes('home_quote')) await sql`ALTER TABLE profile ADD COLUMN home_quote TEXT DEFAULT 'Menangkap emosi lewat lensa visual, dan membangun solusi lewat baris kode.'`;
    if (!colNames.includes('hl1_title')) await sql`ALTER TABLE profile ADD COLUMN hl1_title VARCHAR(255) DEFAULT 'VISUAL ARTS'`;
    if (!colNames.includes('hl1_desc')) await sql`ALTER TABLE profile ADD COLUMN hl1_desc TEXT DEFAULT 'Fotografi, Sinematografi, & UI/UX Design.'`;
    if (!colNames.includes('hl2_title')) await sql`ALTER TABLE profile ADD COLUMN hl2_title VARCHAR(255) DEFAULT 'DIGITAL ENGINEERING'`;
    if (!colNames.includes('hl2_desc')) await sql`ALTER TABLE profile ADD COLUMN hl2_desc TEXT DEFAULT 'Next.js, React, & Modern Web Development.'`;
    if (!colNames.includes('hl3_title')) await sql`ALTER TABLE profile ADD COLUMN hl3_title VARCHAR(255) DEFAULT 'CORE PASSION'`;
    if (!colNames.includes('hl3_desc')) await sql`ALTER TABLE profile ADD COLUMN hl3_desc TEXT DEFAULT 'Memadukan Estetika Visual dengan Performa Interaktif.'`;

    console.log("Done adding home highlights columns!");
  } catch (err) {
    console.error("Error:", err);
  }
}

fixDb();
