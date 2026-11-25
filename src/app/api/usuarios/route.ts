import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function generateTempPassword() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("panel_users")
    .select("id, name, email, role, is_active, phone, notes, verification_token")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ users: data || [] });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    let generatedPassword: string | null = null;

    if (updates.is_active !== undefined) {
      updateData.is_active = updates.is_active;
      // Si se esta activando y no tiene password_hash, generar una clave temporal
      if (updates.is_active === true) {
        const { data: user } = await supabaseAdmin
          .from("panel_users")
          .select("password_hash")
          .eq("id", id)
          .single();
        if (!user?.password_hash) {
          generatedPassword = generateTempPassword();
          updateData.password_hash = bcrypt.hashSync(generatedPassword, 10);
        }
      }
    }

    if (updates.password && typeof updates.password === "string" && updates.password.length >= 4) {
      updateData.password_hash = bcrypt.hashSync(updates.password, 10);
    }

    if (updates.role && ["empresa", "administrador", "asesor"].includes(updates.role)) {
      updateData.role = updates.role;
    }

    if (updates.name) {
      updateData.name = updates.name;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("panel_users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data, password: generatedPassword });
  } catch {
    return NextResponse.json({ error: "Solicitud invalida" }, { status: 400 });
  }
}
