import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CtaLevels } from "@/components/CtaLevels";
import { PageHero } from "@/components/PageElements";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto · Cotizar Bomba de Calor | Evaluación Técnica Gratis",
  description: "Cotice bombas de calor NAE para su edificio o copropiedad. Atención por WhatsApp para administradores, comités y asesores. Evaluación técnica sin compromiso.",
  alternates: { canonical: "/contacto" },
  keywords: ["cotizar bomba de calor", "bomba de calor precio", "evaluación bomba de calor", "contacto Prosol"],
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ perfil?: string }> }) {
  const { perfil } = await searchParams;
  const initialProfile = ["administrador", "comite", "asesor", "otro"].includes(perfil ?? "") ? perfil! : "administrador";
  return <>
    <PageHero eyebrow="Contacto directo" title="Cuéntenos qué necesita resolver." intro="Administrador, presidente de comité o asesor: su conversación comienza con los antecedentes correctos y un canal directo con Prosol." index="05 / CONTACTO" />
    <section className="section"><div className="container contact-layout"><aside className="contact-aside"><span className="eyebrow">Canales aprobados</span><h2>Hablemos con claridad.</h2><p>WhatsApp es nuestro canal comercial principal. Respondemos dentro de 24 horas hábiles, sin indicadores falsos de disponibilidad.</p><div className="contact-channel"><strong>WhatsApp comercial</strong><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">{site.phoneDisplay}</a><small>Responsable del canal: Alejandro Olate.</small></div><div className="contact-channel"><strong>Correo comercial y ARSOP</strong><a href={`mailto:${site.email}`}>{site.email}</a></div><div className="contact-channel"><strong>Horario</strong><span>{site.hours}</span><small>{site.responseTime}</small></div><div className="contact-channel"><strong>Cobertura</strong><span>{site.coverage}</span></div><div className="seo-content" style={{ marginTop: '1.5rem' }}><p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>¿Necesita <strong>cotizar una bomba de calor</strong> para su edificio? Complete el formulario o escríbanos por WhatsApp. Evaluamos su proyecto sin compromiso y le entregamos una propuesta técnica de <strong>instalación de bomba de calor</strong> dimensionada para su comunidad.</p></div></aside><ContactForm initialProfile={initialProfile} origin={`/contacto${perfil ? `?perfil=${perfil}` : ""}`} /></div></section>
    <CtaLevels compact />
  </>;
}
