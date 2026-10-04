import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const photos = await req.json();

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json({ error: "Invalid data format. Expected a non-empty JSON array." }, { status: 400 });
    }

    const sql = getDb();
    
    // Insert each photo sequentially (or could use transaction if supported)
    let insertedCount = 0;
    
    for (const photo of photos) {
      const { title, title_en, src, category, is_featured, featured_description, featured_description_en, display_order, is_published } = photo;
      
      if (!title || !src || !category) {
        continue; // Skip invalid entries
      }

      await sql`
        INSERT INTO photos (title, title_en, src, category, is_featured, featured_description, featured_description_en, display_order, is_published)
        VALUES (${title}, ${title_en || ""}, ${src}, ${category}, ${is_featured || false}, ${featured_description || ""}, ${featured_description_en || ""}, ${display_order || 0}, ${is_published !== undefined ? is_published : false})
      `;
      insertedCount++;
    }

    return NextResponse.json({ success: true, count: insertedCount }, { status: 201 });
  } catch (error) {
    console.error("Error creating bulk photos:", error);
    return NextResponse.json({ error: "Failed to create photos" }, { status: 500 });
  }
}
