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

    let message = "";

    // 1. Process Blogs
    const oldestDraftBlogs = await sql`
      SELECT id FROM blogs 
      WHERE is_published = false 
      ORDER BY id ASC 
      LIMIT 1
    `;

    if (oldestDraftBlogs.length > 0) {
      const draftId = oldestDraftBlogs[0].id;
      await sql`
        UPDATE blogs 
        SET is_published = true, created_at = NOW() 
        WHERE id = ${draftId}
      `;
      message += `Published blog ${draftId}. `;
    }

    // 2. Process Photos (Gallery)
    const oldestDraftPhotos = await sql`
      SELECT id FROM photos 
      WHERE is_published = false 
      ORDER BY id ASC 
      LIMIT 1
    `;

    if (oldestDraftPhotos.length > 0) {
      const photoId = oldestDraftPhotos[0].id;
      await sql`
        UPDATE photos 
        SET is_published = true, created_at = NOW() 
        WHERE id = ${photoId}
      `;
      message += `Published photo ${photoId}.`;
    }

    if (!message) {
      message = "No draft articles or photos to publish.";
    }

    return NextResponse.json({ success: true, message: message.trim() });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  }
}
