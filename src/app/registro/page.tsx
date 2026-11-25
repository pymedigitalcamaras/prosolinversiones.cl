import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/panel/RegisterForm";

export const metadata: Metadata = {
  title: "Solicitar acceso - Prosol Inversiones",
  description: "Solicite acceso al panel de Prosol Inversiones.",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="access-page">
      <section className="access-intro">
        <Link className="access-back" href="/acceso">
          <ArrowLeft size={17} />
          Volver al acceso
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
          <span className="eyebrow">Solicitud de acceso</span>
          <h1>Solicite acceso al panel</h1>
          <p>
            Complete el formulario y un administrador evaluara su solicitud.
            Recibira un correo cuando su cuenta sea activada.
          </p>
        </div>
      </section>
      <section className="access-panel" aria-labelledby="register-form-title">
        <div className="access-form-wrap">
          <h2 id="register-form-title">Datos de solicitud</h2>
          <RegisterForm />
        </div>
      </section>
    </div>
  );
}
