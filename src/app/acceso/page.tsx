import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/panel/LoginForm";
import { getPanelSession } from "@/lib/auth/session";
import { panelHome } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Acceso de equipo - Prosol Inversiones",
  description: "Acceso restringido a los paneles administrativos de Prosol Inversiones.",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const session = await getPanelSession();
  if (session) redirect(panelHome(session.role));

  return (
    <div className="access-page">
      <section className="access-intro">
        <Link className="access-back" href="/">
          <ArrowLeft size={17} />
          Volver al sitio público
        </Link>
        <div className="access-brand">
          <Image
            src="/images/logo-prosol.png"
            alt="Prosol Inversiones"
            width={190}
            height={61}
          />
        </div>
        <div className="access-intro-copy">
          <span className="eyebrow">
            <LockKeyhole size={16} />
            Acceso restringido
          </span>
          <h1>Panel de gestion de Prosol Inversiones</h1>
          <p>
            Acceso exclusivo para el equipo de Prosol, administradores de edificios
            y asesores en copropiedad autorizados.
          </p>
        </div>
        <div className="access-security">
          <ShieldCheck size={22} />
          <span>
            Conexion activa con Supabase. Datos protegidos bajo la Ley 21.719.
          </span>
        </div>
      </section>
      <section className="access-panel" aria-labelledby="access-form-title">
        <div className="access-form-wrap">
          <h2 id="access-form-title">Ingrese a su panel</h2>
          <p>
            Ingrese su correo y clave de acceso. La sesion dura 8 horas.
          </p>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
