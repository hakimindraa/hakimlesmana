import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const isAuth = await getSessionFromCookies();
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Database initialized successfully" });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 });
  }
}
