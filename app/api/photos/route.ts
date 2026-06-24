import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

// GET all photos
export async function GET() {
  try {
    const sql = getDb();
    const photos = await sql`SELECT * FROM photos ORDER BY display_order ASC, created_at DESC`;
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

// POST create photo
export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, title_en, src, category, is_featured, featured_description, featured_description_en, display_order } = await req.json();

    if (!title || !src || !category) {
      return NextResponse.json({ error: "Title, src, and category are required" }, { status: 400 });
    }

    const sql = getDb();
    const result = await sql`
      INSERT INTO photos (title, title_en, src, category, is_featured, featured_description, featured_description_en, display_order)
      VALUES (${title}, ${title_en || ""}, ${src}, ${category}, ${is_featured || false}, ${featured_description || ""}, ${featured_description_en || ""}, ${display_order || 0})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
  }
}

// PUT update photo
export async function PUT(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, title, title_en, src, category, is_featured, featured_description, featured_description_en, display_order } = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    const result = await sql`
      UPDATE photos 
      SET title = ${title}, title_en = ${title_en || ""}, src = ${src}, category = ${category}, 
          is_featured = ${is_featured || false}, featured_description = ${featured_description || ""},
          featured_description_en = ${featured_description_en || ""},
          display_order = ${display_order || 0}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

// DELETE photo
export async function DELETE(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    await sql`DELETE FROM photos WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
