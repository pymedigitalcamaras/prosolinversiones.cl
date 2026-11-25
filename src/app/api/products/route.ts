import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requirePanelRole } from "@/lib/auth/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public GET — used by catalog page
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data || [] });
}

// Protected POST/PUT/DELETE for panel
export async function POST(request: NextRequest) {
  const auth = await requirePanelRole("empresa");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        slug: body.slug,
        name: body.name,
        short_name: body.short_name,
        model: body.model,
        category: body.category,
        description: body.description,
        application: body.application,
        image: body.image,
        highlights: body.highlights || [],
        specs: body.specs || [],
        source_page: body.source_page || "",
        sort_order: body.sort_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data }, { status: 201 });
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
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data });
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

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
