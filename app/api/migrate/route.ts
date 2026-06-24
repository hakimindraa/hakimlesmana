import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";

import { initializeDatabase } from "@/lib/db";

export async function GET() {
  const isAuth = await getSessionFromCookies();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await initializeDatabase();
    
    const sql = getDb();

    // Add hero_image column if it doesn't exist
    await sql`
      ALTER TABLE profile
      ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT ''
    `;
    await sql`
      ALTER TABLE profile
      ADD COLUMN IF NOT EXISTS about_subtitle VARCHAR(255) DEFAULT 'CREATIVE TECHNOLOGIST'
    `;
    await sql`
      ALTER TABLE profile
      ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'I build and create — from pixels to products.'
    `;

    return NextResponse.json({
      success: true,
      message: "Migration: hero_image column added to profile table",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
