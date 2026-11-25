import Link from "next/link";
import { ArrowRight, Building2, Handshake, Users } from "lucide-react";

const items = [
  { icon: Building2, number: "01", title: "Administrador", text: "Solicite una evaluación técnica para su edificio y revise alternativas con respaldo profesional.", href: "/contacto?perfil=administrador", action: "Evaluar mi edificio" },
  { icon: Users, number: "02", title: "Presidente de comité", text: "Pida antecedentes claros para presentar la oportunidad y sus condiciones al comité.", href: "/contacto?perfil=comite", action: "Pedir antecedentes" },
  { icon: Handshake, number: "03", title: "Asesor en copropiedad", text: "Conversemos sobre una relación comercial legítima y las comunidades que usted asesora.", href: "/contacto?perfil=asesor", action: "Conocer el canal" },
];

export function CtaLevels({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`cta-levels ${compact ? "compact" : ""}`} aria-labelledby="cta-title">
      <div className="container">
        <div className="section-heading light-heading">
          <span className="eyebrow">La conversación correcta</span>
          <h2 id="cta-title">Un proyecto. Tres formas de avanzar.</h2>
          <p>Elija su perfil y cuéntenos qué necesita resolver.</p>
        </div>
        <div className="cta-grid">
          {items.map(({ icon: Icon, ...item }) => (
            <article className="cta-item" key={item.title}>
              <div className="cta-item-top"><Icon size={25} aria-hidden="true" /><span>{item.number}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link href={item.href}>{item.action}<ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
        <p className="commission-note">Prosol no paga comisiones a administradores. Las comisiones corresponden exclusivamente a colaboradores o asesores con una relación comercial legítima.</p>
      </div>
    </section>
  );
}
