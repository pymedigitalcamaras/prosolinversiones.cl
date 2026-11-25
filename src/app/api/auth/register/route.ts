import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > 4096)
    return json({ message: "Solicitud demasiado grande." }, 413);

  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
    return json({ message: "La solicitud no es valida." }, 400);
  }

  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const phone = String(input.phone || "").trim();
  const role = String(input.role || "").trim();
  const message = String(input.message || "").trim();

  if (!name || name.length < 2) return json({ message: "Ingrese su nombre completo." }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ message: "Ingrese un correo valido." }, 400);
  if (!role || !["empresa", "administrador", "asesor"].includes(role))
    return json({ message: "Seleccione un perfil valido." }, 400);

  // Verificar si ya existe
  const { data: existing } = await supabaseAdmin
    .from("panel_users")
    .select("id, is_active")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (existing.is_active) {
      return json({ message: "Ya existe una cuenta activa con ese correo." }, 409);
    }
    // Si existe pero está inactivo, actualizar la solicitud
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const { error } = await supabaseAdmin
      .from("panel_users")
      .update({
        name,
        role,
        phone: phone || null,
        notes: message || null,
        verification_token: verificationToken,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      console.error("Register update error:", error);
      return json({ message: "No fue posible actualizar la solicitud." }, 500);
    }

    return json({
      message: "Solicitud actualizada correctamente. Un administrador la evaluara pronto.",
      token: verificationToken,
    }, 201);
  }

  // Crear nuevo usuario pendiente
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const { error } = await supabaseAdmin.from("panel_users").insert({
    name,
    email,
    role,
    is_active: false,
    password_hash: null,
    phone: phone || null,
    notes: message || null,
    verification_token: verificationToken,
    email_verified: false,
  });

  if (error) {
    console.error("Register insert error:", error);
    return json({ message: "No fue posible registrar la solicitud. Intente nuevamente." }, 500);
  }

  return json({
    message: "Solicitud registrada correctamente. Un administrador la evaluara y le contactara por correo.",
    token: verificationToken,
  }, 201);
}
