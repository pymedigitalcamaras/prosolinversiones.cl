import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { ok: true, redirectTo: "/acceso" },
    { headers: { "Cache-Control": "no-store" } }
  );
  response.cookies.set(PANEL_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
