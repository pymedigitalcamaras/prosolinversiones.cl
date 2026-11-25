import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requirePanelRole } from "@/lib/auth/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert({
        quote: body.quote,
        role: body.role,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ testimonial: data }, { status: 201 });
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
      .from("testimonials")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ testimonial: data });
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

  const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
