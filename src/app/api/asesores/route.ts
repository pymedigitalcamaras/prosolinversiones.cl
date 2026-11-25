import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: clientes y comisiones de un asesor
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const advisorId = searchParams.get("advisor_id");

  if (!advisorId) {
    return NextResponse.json({ error: "advisor_id requerido" }, { status: 400 });
  }

  const [clientsRes, commissionsRes] = await Promise.all([
    supabaseAdmin.from("advisor_clients").select("*").eq("advisor_id", advisorId),
    supabaseAdmin.from("advisor_commissions").select("*").eq("advisor_id", advisorId),
  ]);

  if (clientsRes.error) {
    return NextResponse.json({ error: clientsRes.error.message }, { status: 500 });
  }
  if (commissionsRes.error) {
    return NextResponse.json({ error: commissionsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    clients: clientsRes.data || [],
    commissions: commissionsRes.data || [],
  });
}
