import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

const ALLOWED_TABLES = ["resume_skills", "resume_experiences", "resume_awards", "resume_gear"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const table = resolvedParams.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const sql = getDb();
    let result;

    if (table === "resume_skills") {
      result = await sql`
        INSERT INTO resume_skills (category, name, display_order) 
        VALUES (${data.category}, ${data.name}, ${data.display_order || 0}) RETURNING *`;
    } else if (table === "resume_experiences") {
      result = await sql`
        INSERT INTO resume_experiences (start_date, end_date, role, client, description, display_order) 
        VALUES (${data.start_date || ''}, ${data.end_date || ''}, ${data.role}, ${data.client}, ${data.description || ''}, ${data.display_order || 0}) RETURNING *`;
    } else if (table === "resume_awards") {
      result = await sql`
        INSERT INTO resume_awards (type, year, title, issuer, display_order) 
        VALUES (${data.type || 'award'}, ${data.year || ''}, ${data.title}, ${data.issuer || ''}, ${data.display_order || 0}) RETURNING *`;
    } else if (table === "resume_gear") {
      result = await sql`
        INSERT INTO resume_gear (category, name, display_order) 
        VALUES (${data.category}, ${data.name}, ${data.display_order || 0}) RETURNING *`;
    }

    return NextResponse.json(result?.[0]);
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const table = resolvedParams.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID is required for update" }, { status: 400 });

    const sql = getDb();
    let result;

    if (table === "resume_skills") {
      result = await sql`
        UPDATE resume_skills SET 
          category = ${data.category}, name = ${data.name}, display_order = ${data.display_order || 0}
        WHERE id = ${data.id} RETURNING *`;
    } else if (table === "resume_experiences") {
      result = await sql`
        UPDATE resume_experiences SET 
          start_date = ${data.start_date || ''}, end_date = ${data.end_date || ''}, 
          role = ${data.role}, client = ${data.client}, description = ${data.description || ''}, display_order = ${data.display_order || 0}
        WHERE id = ${data.id} RETURNING *`;
    } else if (table === "resume_awards") {
      result = await sql`
        UPDATE resume_awards SET 
          type = ${data.type || 'award'}, year = ${data.year || ''}, title = ${data.title}, 
          issuer = ${data.issuer || ''}, display_order = ${data.display_order || 0}
        WHERE id = ${data.id} RETURNING *`;
    } else if (table === "resume_gear") {
      result = await sql`
        UPDATE resume_gear SET 
          category = ${data.category}, name = ${data.name}, display_order = ${data.display_order || 0}
        WHERE id = ${data.id} RETURNING *`;
    }

    return NextResponse.json(result?.[0]);
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ table: string }> }) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolvedParams = await params;
  const table = resolvedParams.table;
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const sql = getDb();
    // Gunakan static query karena nama tabel di parameterized query PostgreSQL tidak diizinkan untuk nama tabel secara langsung.
    // Karena ALLOWED_TABLES sudah divalidasi, ini aman.
    if (table === "resume_skills") await sql`DELETE FROM resume_skills WHERE id = ${id}`;
    else if (table === "resume_experiences") await sql`DELETE FROM resume_experiences WHERE id = ${id}`;
    else if (table === "resume_awards") await sql`DELETE FROM resume_awards WHERE id = ${id}`;
    else if (table === "resume_gear") await sql`DELETE FROM resume_gear WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
