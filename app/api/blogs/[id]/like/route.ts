import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sql = getDb();
    
    // Increment likes_count
    const result = await sql`
      UPDATE blogs 
      SET likes_count = COALESCE(likes_count, 0) + 1 
      WHERE id = ${id} 
      RETURNING likes_count
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, likes_count: result[0].likes_count });
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 });
  }
}
