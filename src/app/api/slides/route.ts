import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requirePanelRole } from "@/lib/auth/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Public endpoint - no auth needed for reading slides
  const { data, error } = await supabaseAdmin
    .from("slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ slides: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("slides")
      .insert({
        image: body.image,
        alt: body.alt,
        eyebrow: body.eyebrow,
        title: body.title,
        text: body.text,
        href: body.href,
        action: body.action,
        sort_order: body.sort_order || 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slide: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Solicitud invalida" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("slides")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slide: data });
  } catch {
    return NextResponse.json({ error: "Solicitud invalida" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const { error } = await supabaseAdmin.from("slides").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
