const { neon } = require('@neondatabase/serverless');

async function fixDb() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log("Menambahkan kolom about_subtitle...");
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS about_subtitle VARCHAR(255) DEFAULT 'CREATIVE TECHNOLOGIST'`;
    console.log("Berhasil!");

    console.log("Menambahkan kolom about_title...");
    await sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'I build and create — from pixels to products.'`;
    console.log("Berhasil!");
    
    console.log("Selesai memperbaiki database!");
  } catch (err) {
    console.error("Error:", err);
  }
}

fixDb();
