import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: si completó el campo "website", es un bot
    if (body.website && String(body.website).trim().length > 0) {
      return NextResponse.json(
        { message: "Solicitud procesada correctamente." },
        { status: 200 }
      );
    }

    // Validación básica
    const errors: Record<string, string> = {};
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const profile = String(body.profile || "").trim();
    const building = String(body.building || "").trim();
    const message = String(body.message || "").trim();
    const origin = String(body.origin || "/contacto").trim();
    const mode = String(body.mode || "contacto").trim();
    const consent = body.consent === "accepted";

    if (!name) errors.name = "Ingrese su nombre y apellido.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Ingrese un correo electrónico válido.";
    if (mode === "contacto" && !phone) errors.phone = "Ingrese su número de teléfono.";
    if (!message) errors.message = "Describa qué necesita evaluar.";
    if (!consent) errors.consent = "Debe aceptar el aviso de privacidad para continuar.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Revise los campos indicados.", errors }, { status: 422 });
    }

    // Guardar en Supabase
    const { error } = await supabaseAdmin.from("contacts").insert({
      full_name: name,
      email,
      phone: phone || null,
      company: building || null,
      profile: profile || "otro",
      building_name: building || null,
      message,
      source_path: origin,
      status: "nuevo",
      legal_hold: false,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { message: "No fue posible guardar la solicitud en este momento. Intente nuevamente o contacte por WhatsApp." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Solicitud recibida correctamente. Nos contactaremos con usted dentro de 24 horas hábiles." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error al procesar la solicitud. Intente nuevamente o contacte por WhatsApp." },
      { status: 400 }
    );
  }
}
