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
    // Categories
    let cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'categories'`;
    let colNames = cols.map(c => c.column_name);
    if (!colNames.includes('name_en')) await sql`ALTER TABLE categories ADD COLUMN name_en VARCHAR(100)`;

    // Photos
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'photos'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('title_en')) await sql`ALTER TABLE photos ADD COLUMN title_en VARCHAR(255)`;
    if (!colNames.includes('featured_description_en')) await sql`ALTER TABLE photos ADD COLUMN featured_description_en TEXT`;

    // Certificates
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'certificates'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('title_en')) await sql`ALTER TABLE certificates ADD COLUMN title_en VARCHAR(255)`;
    if (!colNames.includes('description_en')) await sql`ALTER TABLE certificates ADD COLUMN description_en TEXT`;

    // Resume Skills
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'resume_skills'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('category_en')) await sql`ALTER TABLE resume_skills ADD COLUMN category_en VARCHAR(100)`;
    if (!colNames.includes('name_en')) await sql`ALTER TABLE resume_skills ADD COLUMN name_en VARCHAR(255)`;

    // Resume Experiences
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'resume_experiences'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('role_en')) await sql`ALTER TABLE resume_experiences ADD COLUMN role_en VARCHAR(255)`;
    if (!colNames.includes('client_en')) await sql`ALTER TABLE resume_experiences ADD COLUMN client_en VARCHAR(255)`;
    if (!colNames.includes('description_en')) await sql`ALTER TABLE resume_experiences ADD COLUMN description_en TEXT`;

    // Resume Awards
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'resume_awards'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('title_en')) await sql`ALTER TABLE resume_awards ADD COLUMN title_en VARCHAR(255)`;
    if (!colNames.includes('issuer_en')) await sql`ALTER TABLE resume_awards ADD COLUMN issuer_en VARCHAR(255)`;

    // Resume Gear
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'resume_gear'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('category_en')) await sql`ALTER TABLE resume_gear ADD COLUMN category_en VARCHAR(100)`;
    if (!colNames.includes('name_en')) await sql`ALTER TABLE resume_gear ADD COLUMN name_en VARCHAR(255)`;

    // Tech Projects
    cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tech_projects'`;
    colNames = cols.map(c => c.column_name);
    if (!colNames.includes('title_en')) await sql`ALTER TABLE tech_projects ADD COLUMN title_en VARCHAR(255)`;
    if (!colNames.includes('description_en')) await sql`ALTER TABLE tech_projects ADD COLUMN description_en TEXT`;
    if (!colNames.includes('tech_stack_en')) await sql`ALTER TABLE tech_projects ADD COLUMN tech_stack_en VARCHAR(500)`;

    console.log("Done adding full i18n columns!");
  } catch (err) {
    console.error("Error:", err);
  }
}

fixDb();
