import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const certs = await sql`SELECT * FROM certificates ORDER BY created_at DESC`;
    return NextResponse.json(certs);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, title_en, issuer, date, image_url, description, description_en } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const sql = getDb();
    const result = await sql`
      INSERT INTO certificates (title, title_en, issuer, date, image_url, description, description_en)
      VALUES (${title}, ${title_en || ""}, ${issuer || ""}, ${date || ""}, ${image_url || ""}, ${description || ""}, ${description_en || ""})
      RETURNING *
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, title, title_en, issuer, date, image_url, description, description_en } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    const result = await sql`
      UPDATE certificates SET title = ${title}, title_en = ${title_en || ""}, issuer = ${issuer || ""}, 
      date = ${date || ""}, image_url = ${image_url || ""}, description = ${description || ""}, description_en = ${description_en || ""}
      WHERE id = ${id} RETURNING *
    `;
    if (result.length === 0) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    await sql`DELETE FROM certificates WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
