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

    if (!colNames.includes('tagline_en')) await sql`ALTER TABLE profile ADD COLUMN tagline_en TEXT DEFAULT ''`;
    if (!colNames.includes('bio_en')) await sql`ALTER TABLE profile ADD COLUMN bio_en TEXT DEFAULT ''`;
    if (!colNames.includes('about_text_en')) await sql`ALTER TABLE profile ADD COLUMN about_text_en TEXT DEFAULT ''`;
    if (!colNames.includes('about_subtitle_en')) await sql`ALTER TABLE profile ADD COLUMN about_subtitle_en VARCHAR(255) DEFAULT ''`;
    if (!colNames.includes('about_title_en')) await sql`ALTER TABLE profile ADD COLUMN about_title_en TEXT DEFAULT ''`;
    if (!colNames.includes('home_quote_en')) await sql`ALTER TABLE profile ADD COLUMN home_quote_en TEXT DEFAULT ''`;
    if (!colNames.includes('hl1_title_en')) await sql`ALTER TABLE profile ADD COLUMN hl1_title_en VARCHAR(255) DEFAULT ''`;
    if (!colNames.includes('hl1_desc_en')) await sql`ALTER TABLE profile ADD COLUMN hl1_desc_en TEXT DEFAULT ''`;
    if (!colNames.includes('hl2_title_en')) await sql`ALTER TABLE profile ADD COLUMN hl2_title_en VARCHAR(255) DEFAULT ''`;
    if (!colNames.includes('hl2_desc_en')) await sql`ALTER TABLE profile ADD COLUMN hl2_desc_en TEXT DEFAULT ''`;
    if (!colNames.includes('hl3_title_en')) await sql`ALTER TABLE profile ADD COLUMN hl3_title_en VARCHAR(255) DEFAULT ''`;
    if (!colNames.includes('hl3_desc_en')) await sql`ALTER TABLE profile ADD COLUMN hl3_desc_en TEXT DEFAULT ''`;

    console.log("Done adding i18n columns!");
  } catch (err) {
    console.error("Error:", err);
  }
}

fixDb();
