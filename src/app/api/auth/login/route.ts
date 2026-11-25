import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/auth/users";
import { createSessionToken, PANEL_SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { panelHome } from "@/lib/auth/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > 2048)
    return json({ code: "BODY_TOO_LARGE", message: "Solicitud demasiado grande." }, 413);

  let input: { email?: unknown; password?: unknown };
  try {
    input = await request.json();
  } catch {
    return json({ code: "INVALID_JSON", message: "La solicitud no es válida." }, 400);
  }

  if (
    typeof input.email !== "string" ||
    typeof input.password !== "string" ||
    input.email.length > 254 ||
    input.password.length > 200
  ) {
    return json({ code: "INVALID_INPUT", message: "Revise las credenciales ingresadas." }, 400);
  }

  const email = input.email.trim().toLowerCase();
  const now = Date.now();
  const record = attempts.get(email);
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    return json(
      { code: "RATE_LIMITED", message: "Demasiados intentos. Espere cinco minutos." },
      429
    );
  }

  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    attempts.set(email, {
      count: record && record.resetAt > now ? record.count + 1 : 1,
      resetAt: record && record.resetAt > now ? record.resetAt : now + WINDOW_MS,
    });
    return json({ code: "INVALID_CREDENTIALS", message: "Correo o clave incorrectos." }, 401);
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);
  if (!valid) {
    attempts.set(email, {
      count: record && record.resetAt > now ? record.count + 1 : 1,
      resetAt: record && record.resetAt > now ? record.resetAt : now + WINDOW_MS,
    });
    return json({ code: "INVALID_CREDENTIALS", message: "Correo o clave incorrectos." }, 401);
  }

  attempts.delete(email);
  const token = createSessionToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const response = json({ redirectTo: panelHome(user.role) });
  response.cookies.set(PANEL_SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
