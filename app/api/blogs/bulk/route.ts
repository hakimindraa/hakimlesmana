import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

// Helper function to extract a value from frontmatter
const extractValue = (frontmatter: string, key: string): string => {
  const regex = new RegExp(`^${key}:\\s*['"]?(.*?)['"]?$`, "m");
  const match = frontmatter.match(regex);
  return match ? match[1].trim() : "";
};

export async function POST(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { markdown } = await req.json();
    if (!markdown) {
      return NextResponse.json({ error: "Markdown content is required" }, { status: 400 });
    }

    const posts = markdown.split("---POST---").map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    
    if (posts.length === 0) {
      return NextResponse.json({ error: "No valid posts found in the file." }, { status: 400 });
    }

    const sql = getDb();
    let insertedCount = 0;

    for (const post of posts) {
      // Post should start with "---"
      if (!post.startsWith("---")) continue;
      
      const parts = post.split("---");
      // parts[0] is empty
      // parts[1] is the frontmatter
      // parts[2...] is the content
      if (parts.length < 3) continue;

      const frontmatter = parts[1];
      const fullBody = parts.slice(2).join("---").trim();
      
      // Extract frontmatter values
      const title = extractValue(frontmatter, "title");
      const title_en = extractValue(frontmatter, "title_en");
      const category = extractValue(frontmatter, "category");
      const category_en = extractValue(frontmatter, "category_en");
      const read_time = extractValue(frontmatter, "read_time");
      const excerpt = extractValue(frontmatter, "excerpt");
      const excerpt_en = extractValue(frontmatter, "excerpt_en");
      let image_url = extractValue(frontmatter, "image_url");

      // Extract bodies
      const bodyParts = fullBody.split("===EN===");
      const content = bodyParts[0]?.trim() || "";
      const content_en = bodyParts[1]?.trim() || "";

      // Fallback: If no image_url in frontmatter, try to find the first markdown image ![alt](url) in content
      if (!image_url) {
        const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (imgMatch) {
          image_url = imgMatch[1];
        }
      }

      // Save to database as DRAFT (is_published = false)
      await sql`
        INSERT INTO blogs (
          title, title_en, excerpt, excerpt_en, content, content_en, 
          category, category_en, image_url, read_time, is_published, display_order
        ) VALUES (
          ${title}, ${title_en}, ${excerpt}, ${excerpt_en}, ${content}, ${content_en},
          ${category}, ${category_en}, ${image_url}, ${read_time}, false, 0
        )
      `;
      insertedCount++;
    }

    return NextResponse.json({ success: true, inserted: insertedCount });
  } catch (error) {
    console.error("Error bulk inserting blogs:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}
