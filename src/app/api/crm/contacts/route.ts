import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: listar contactos
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const profile = searchParams.get("profile");

  let query = supabaseAdmin.from("contacts").select("*").order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (profile) query = query.eq("profile", profile);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ contacts: data || [] });
}

// POST: crear contacto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ contact: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}

// PATCH: actualizar contacto
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.status) updateData.status = updates.status;
    if (updates.responsible_id !== undefined) updateData.responsible_id = updates.responsible_id || null;
    if (updates.full_name) updateData.full_name = updates.full_name;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.message) updateData.message = updates.message;
    if (updates.notes) updateData.notes = updates.notes;

    const { data, error } = await supabaseAdmin
      .from("contacts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ contact: data });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
