import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET() {
  const isAuthenticated = await getSessionFromCookies();
  return NextResponse.json({ authenticated: isAuthenticated });
}
