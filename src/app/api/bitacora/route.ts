import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const buildingId = searchParams.get("building_id");

  let query = supabaseAdmin.from("log_entries").select("*").order("date", { ascending: false });
  if (buildingId) query = query.eq("building_id", buildingId);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ entries: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from("log_entries")
      .insert(body)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ entry: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
