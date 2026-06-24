import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    
    // Ambil data dari keempat tabel secara paralel
    const [skills, experiences, awards, gear] = await Promise.all([
      sql`SELECT * FROM resume_skills ORDER BY display_order ASC, id ASC`,
      sql`SELECT * FROM resume_experiences ORDER BY display_order ASC, start_date DESC`,
      sql`SELECT * FROM resume_awards ORDER BY display_order ASC, year DESC`,
      sql`SELECT * FROM resume_gear ORDER BY display_order ASC, id ASC`,
    ]);

    return NextResponse.json({
      skills,
      experiences,
      awards,
      gear
    });
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return NextResponse.json({ error: "Failed to fetch resume data" }, { status: 500 });
  }
}
