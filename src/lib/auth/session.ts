import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { PanelSession } from "./types";

export const PANEL_SESSION_COOKIE = "prosol_panel_session";
const SESSION_SECONDS = 8 * 60 * 60; // 8 horas

// Clave fija para firmar tokens de sesión del panel
const FIXED_SECRET = "prosol-panel-fixed-secret-2026-11-21-naebombasdecalor";

const signature = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export const createSessionToken = (
  user: Omit<PanelSession, "expiresAt">,
  nowSeconds = Math.floor(Date.now() / 1000)
) => {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: nowSeconds,
      exp: nowSeconds + SESSION_SECONDS,
    })
  ).toString("base64url");
  return `${payload}.${signature(payload, FIXED_SECRET)}`;
};

export const verifySessionToken = (token: string | undefined): PanelSession | null => {
  if (!token) return null;
  const [payload, receivedSignature, extra] = token.split(".");
  if (!payload || !receivedSignature || extra) return null;

  const expected = Buffer.from(signature(payload, FIXED_SECRET));
  const received = Buffer.from(receivedSignature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub: string;
      name: string;
      email: string;
      role: string;
      iat: number;
      exp: number;
    };
    const now = Math.floor(Date.now() / 1000);
    if (
      !Number.isInteger(data.exp) ||
      !Number.isInteger(data.iat) ||
      data.exp <= now ||
      data.iat > now + 30
    )
      return null;
    return {
      id: data.sub,
      name: data.name,
      email: data.email,
      role: data.role as PanelSession["role"],
      expiresAt: data.exp,
    };
  } catch {
    return null;
  }
};

export const getPanelSession = async () => {
  const store = await cookies();
  return verifySessionToken(store.get(PANEL_SESSION_COOKIE)?.value);
};

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: true,
  path: "/",
  maxAge: SESSION_SECONDS,
};
