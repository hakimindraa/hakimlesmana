import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  // Validate authorization to ensure only Vercel Cron can call this
  // Vercel sends a specific header 'Authorization: Bearer <CRON_SECRET>' if set in Vercel settings.
  const authHeader = request.headers.get("authorization");
  
  // Note: For local testing or if CRON_SECRET is not set, you might want a fallback or to skip this check locally.
  // In production on Vercel, you should set CRON_SECRET in Environment Variables.
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const sql = getDb();

    // Find the oldest unpublished blog
    const oldestDrafts = await sql`
      SELECT id FROM blogs 
      WHERE is_published = false 
      ORDER BY id ASC 
      LIMIT 1
    `;

    if (oldestDrafts.length === 0) {
      return NextResponse.json({ success: true, message: "No draft articles to publish." });
    }

    const draftId = oldestDrafts[0].id;

    // Publish it and update the created_at to the publish time
    await sql`
      UPDATE blogs 
      SET is_published = true, created_at = NOW() 
      WHERE id = ${draftId}
    `;

    return NextResponse.json({ success: true, published_id: draftId, message: "Article published successfully." });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  }
}
