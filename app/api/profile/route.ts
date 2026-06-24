import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const sql = getDb();
    const profile = await sql`SELECT * FROM profile LIMIT 1`;
    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await getSessionFromRequest(req);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sql = getDb();

    const result = await sql`
      UPDATE profile SET
        name = ${data.name || "Hikra"},
        tagline = ${data.tagline || ""},
        bio = ${data.bio || ""},
        about_text = ${data.about_text || ""},
        about_subtitle = ${data.about_subtitle || ""},
        about_title = ${data.about_title || ""},
        home_quote = ${data.home_quote || ""},
        hl1_title = ${data.hl1_title || ""},
        hl1_desc = ${data.hl1_desc || ""},
        hl2_title = ${data.hl2_title || ""},
        hl2_desc = ${data.hl2_desc || ""},
        hl3_title = ${data.hl3_title || ""},
        hl3_desc = ${data.hl3_desc || ""},
        hero_image = ${data.hero_image || ""},
        email = ${data.email || ""},
        phone = ${data.phone || ""},
        whatsapp = ${data.whatsapp || ""},
        location = ${data.location || ""},
        instagram = ${data.instagram || ""},
        facebook = ${data.facebook || ""},
        linkedin = ${data.linkedin || ""},
        updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `;

    if (result.length === 0) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
