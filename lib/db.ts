import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(databaseUrl);
}

// ── Initialize database tables ──
export async function initializeDatabase() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      src TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      is_featured BOOLEAN DEFAULT false,
      featured_description TEXT,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS certificates (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      issuer VARCHAR(255),
      date VARCHAR(100),
      image_url TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL DEFAULT 'Hikra',
      tagline VARCHAR(500) DEFAULT '',
      bio TEXT DEFAULT '',
      about_text TEXT DEFAULT '',
      about_subtitle VARCHAR(255) DEFAULT 'CREATIVE TECHNOLOGIST',
      about_title TEXT DEFAULT 'I build and create — from pixels to products.',
      home_quote TEXT DEFAULT 'Menangkap emosi lewat lensa visual, dan membangun solusi lewat baris kode.',
      hl1_title VARCHAR(255) DEFAULT 'VISUAL ARTS',
      hl1_desc TEXT DEFAULT 'Fotografi, Sinematografi, & UI/UX Design.',
      hl2_title VARCHAR(255) DEFAULT 'DIGITAL ENGINEERING',
      hl2_desc TEXT DEFAULT 'Next.js, React, & Modern Web Development.',
      hl3_title VARCHAR(255) DEFAULT 'CORE PASSION',
      hl3_desc TEXT DEFAULT 'Memadukan Estetika Visual dengan Performa Interaktif.',
      tagline_en TEXT DEFAULT '',
      bio_en TEXT DEFAULT '',
      about_text_en TEXT DEFAULT '',
      about_subtitle_en VARCHAR(255) DEFAULT '',
      about_title_en TEXT DEFAULT '',
      home_quote_en TEXT DEFAULT '',
      hl1_title_en VARCHAR(255) DEFAULT '',
      hl1_desc_en TEXT DEFAULT '',
      hl2_title_en VARCHAR(255) DEFAULT '',
      hl2_desc_en TEXT DEFAULT '',
      hl3_title_en VARCHAR(255) DEFAULT '',
      hl3_desc_en TEXT DEFAULT '',
      hero_image TEXT DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      phone VARCHAR(50) DEFAULT '',
      whatsapp VARCHAR(50) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      instagram VARCHAR(255) DEFAULT '',
      facebook VARCHAR(255) DEFAULT '',
      linkedin VARCHAR(255) DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resume_skills (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resume_experiences (
      id SERIAL PRIMARY KEY,
      start_date VARCHAR(100),
      end_date VARCHAR(100),
      role VARCHAR(255) NOT NULL,
      client VARCHAR(255) NOT NULL,
      description TEXT,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resume_awards (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) DEFAULT 'award',
      year VARCHAR(50),
      title VARCHAR(255) NOT NULL,
      issuer VARCHAR(255),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resume_gear (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tech_projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      tech_stack VARCHAR(500),
      image_url TEXT,
      live_url VARCHAR(255),
      github_url VARCHAR(255),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Insert default profile if not exists
  const existing = await sql`SELECT id FROM profile LIMIT 1`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO profile (name, tagline, bio, about_text, hero_image, email, phone, whatsapp, location, instagram)
      VALUES (
        'Hikra',
        'Photographer & Videographer',
        'Capturing timeless moments through the art of photography & cinematic videography.',
        'Saya adalah seorang fotografer dan videografer profesional yang berdedikasi untuk menangkap momen-momen berharga.',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000',
        'hakim@example.com',
        '+62 812 3456 7890',
        '6281234567890',
        'Bandung, Indonesia',
        '#'
      )
    `;
  }

  // Insert default categories if empty
  const cats = await sql`SELECT id FROM categories LIMIT 1`;
  if (cats.length === 0) {
    await sql`INSERT INTO categories (name) VALUES ('Landscape'), ('Urban'), ('Portrait'), ('Nature'), ('Event')`;
  }
}
