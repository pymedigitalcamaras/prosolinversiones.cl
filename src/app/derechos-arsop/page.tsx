import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageElements";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Ejercicio de derechos ARSOP", description: "Solicite acceso, rectificación, supresión, oposición o portabilidad de sus datos personales ante Prosol Inversiones.", alternates: { canonical: "/derechos-arsop" } };

export default function RightsPage() {
  return <><PageHero eyebrow="Derechos ARSOP" title="Usted puede decidir sobre sus datos." intro="Solicite acceso, rectificación, supresión, oposición o portabilidad. Prosol responderá dentro de 30 días corridos." index="LEGAL / 03" />
    <section className="section"><div className="container contact-layout"><aside className="contact-aside"><span className="eyebrow">Procedimiento</span><h2>Una solicitud clara y trazable.</h2><p>Indique el derecho que desea ejercer y entregue solo los antecedentes necesarios para gestionar su requerimiento.</p><div className="contact-channel"><strong>Responsable interno</strong><span>{site.privacyOwner}</span></div><div className="contact-channel"><strong>Canal vigente</strong><a href={`mailto:${site.privacyEmail}?subject=Solicitud%20de%20derechos%20ARSOP`}>{site.privacyEmail}</a><small>Puede enviar su solicitud directamente por este correo.</small></div><div className="contact-channel"><strong>Plazo de respuesta</strong><span>Dentro de 30 días corridos.</span></div><div className="contact-channel"><strong>Verificación y seguridad</strong><span>Podrían solicitarse antecedentes proporcionales para confirmar la identidad y evitar entregar información a terceros.</span></div></aside><ContactForm mode="arsop" origin="/derechos-arsop" /></div></section>
  </>;
}
