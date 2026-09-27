import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sql = getDb();
    
    const blogs = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1`;
    
    if (blogs.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json(blogs[0]);
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
