import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const projects = await sql`SELECT * FROM tech_projects ORDER BY display_order ASC, id DESC`;
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching tech projects:", error);
    return NextResponse.json({ error: "Failed to fetch tech projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sql = getDb();
    const result = await sql`
      INSERT INTO tech_projects (title, description, tech_stack, image_url, live_url, github_url, display_order)
      VALUES (${data.title}, ${data.description || ""}, ${data.tech_stack || ""}, ${data.image_url || ""}, ${data.live_url || ""}, ${data.github_url || ""}, ${data.display_order || 0})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error inserting tech project:", error);
    return NextResponse.json({ error: "Failed to insert tech project" }, { status: 500 });
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
      UPDATE tech_projects SET
        title = ${data.title},
        description = ${data.description || ""},
        tech_stack = ${data.tech_stack || ""},
        image_url = ${data.image_url || ""},
        live_url = ${data.live_url || ""},
        github_url = ${data.github_url || ""},
        display_order = ${data.display_order || 0}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating tech project:", error);
    return NextResponse.json({ error: "Failed to update tech project" }, { status: 500 });
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
    await sql`DELETE FROM tech_projects WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tech project:", error);
    return NextResponse.json({ error: "Failed to delete tech project" }, { status: 500 });
  }
}
