import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const blogs = await sql`SELECT * FROM blogs ORDER BY display_order ASC, created_at DESC`;
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sql = getDb();
    const result = await sql`
      INSERT INTO blogs (title, title_en, excerpt, excerpt_en, content, content_en, category, category_en, read_time, is_published, display_order)
      VALUES (${data.title}, ${data.title_en || ""}, ${data.excerpt || ""}, ${data.excerpt_en || ""}, ${data.content || ""}, ${data.content_en || ""}, ${data.category || ""}, ${data.category_en || ""}, ${data.read_time || ""}, ${data.is_published ?? true}, ${data.display_order || 0})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error inserting blog:", error);
    return NextResponse.json({ error: "Failed to insert blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    const result = await sql`
      UPDATE blogs SET
        title = ${data.title},
        title_en = ${data.title_en || ""},
        excerpt = ${data.excerpt || ""},
        excerpt_en = ${data.excerpt_en || ""},
        content = ${data.content || ""},
        content_en = ${data.content_en || ""},
        category = ${data.category || ""},
        category_en = ${data.category_en || ""},
        read_time = ${data.read_time || ""},
        is_published = ${data.is_published ?? true},
        display_order = ${data.display_order || 0},
        updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    await sql`DELETE FROM blogs WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
