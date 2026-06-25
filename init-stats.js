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
  const sql = neon(dbUrl);
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS impact_stats (
      id SERIAL PRIMARY KEY,
      value VARCHAR(50) NOT NULL,
      value_en VARCHAR(50),
      label VARCHAR(100) NOT NULL,
      label_en VARCHAR(100),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
    `;

    const existingStats = await sql`SELECT id FROM impact_stats LIMIT 1`;
    if (existingStats.length === 0) {
      await sql`INSERT INTO impact_stats (value, value_en, label, label_en, display_order) VALUES ('5+', '5+', 'Tahun Pengalaman', 'Years Experience', 1)`;
      await sql`INSERT INTO impact_stats (value, value_en, label, label_en, display_order) VALUES ('50+', '50+', 'Proyek Selesai', 'Projects Completed', 2)`;
      await sql`INSERT INTO impact_stats (value, value_en, label, label_en, display_order) VALUES ('30+', '30+', 'Klien Puas', 'Happy Clients', 3)`;
      await sql`INSERT INTO impact_stats (value, value_en, label, label_en, display_order) VALUES ('10+', '10+', 'Penghargaan', 'Awards', 4)`;
    }
    console.log("Stats initialized successfully.");
  } catch (err) {
    console.error(err);
  }
}

fixDb();
