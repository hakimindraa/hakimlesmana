import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const isAuth = await getSessionFromCookies();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sql = getDb();

    // Add hero_image column if it doesn't exist
    await sql`
      ALTER TABLE profile
      ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT ''
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
