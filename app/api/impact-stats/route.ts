import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const stats = await sql`SELECT * FROM impact_stats ORDER BY display_order ASC`;
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching impact_stats:", error);
    return NextResponse.json({ error: "Failed to fetch impact stats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sql = getDb();
    
    const result = await sql`
      INSERT INTO impact_stats (value, value_en, label, label_en, display_order) 
      VALUES (${data.value}, ${data.value_en || ""}, ${data.label}, ${data.label_en || ""}, ${data.display_order || 0}) 
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error inserting impact_stats:", error);
    return NextResponse.json({ error: "Failed to insert impact stats" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID is required for update" }, { status: 400 });

    const sql = getDb();
    
    const result = await sql`
      UPDATE impact_stats SET 
        value = ${data.value}, 
        value_en = ${data.value_en || ""}, 
        label = ${data.label}, 
        label_en = ${data.label_en || ""}, 
        display_order = ${data.display_order || 0}
      WHERE id = ${data.id} 
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating impact_stats:", error);
    return NextResponse.json({ error: "Failed to update impact stats" }, { status: 500 });
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
    await sql`DELETE FROM impact_stats WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting impact_stats:", error);
    return NextResponse.json({ error: "Failed to delete impact stats" }, { status: 500 });
  }
}
