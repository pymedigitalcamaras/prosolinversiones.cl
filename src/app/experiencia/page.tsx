import type { Metadata } from "next";
import Image from "next/image";
import { CtaLevels } from "@/components/CtaLevels";
import { PageHero } from "@/components/PageElements";
import { demoBuildings, demoTestimonials } from "@/lib/demo-content";

export const metadata: Metadata = {
  title: "Experiencia · Instalación de Bombas de Calor en Edificios",
  description: "Proyectos de instalación de bombas de calor NAE en edificios y copropiedades de Chile. Experiencia de Prosol en agua caliente sanitaria ACS.",
  alternates: { canonical: "/experiencia" },
  keywords: ["instalación bombas de calor", "proyectos bombas de calor", "bomba de calor edificio", "bomba de calor experiencia"],
};

export default function ExperiencePage() {
  return <>
    <PageHero eyebrow="Experiencia y comunidad" title="Instalación de bombas de calor en edificios de Chile." intro="Proyectos de instalación de bombas de calor NAE para agua caliente sanitaria en edificios y copropiedades de Santiago." index="02 / EXPERIENCIA" />
    <section className="section">
      <div className="container">
        <div className="section-heading"><span className="eyebrow">Proyectos de referencia</span><h2>Bombas de calor NAE instaladas en edificios residenciales.</h2><p>Proyectos reales de instalación de bombas de calor en edificios y comunidades de Chile. Cada proyecto es evaluado técnicamente antes de la ejecución.</p></div>
        <div className="building-grid">{demoBuildings.map((building) => <article className="building-card" key={building.id}><div className="building-image"><Image src={building.image} alt={`Instalación de bomba de calor NAE en ${building.name} - ${building.system}`} fill sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" /></div><div className="building-body"><span className="product-model">{building.id}</span><h3>{building.name}</h3><span className="building-location">{building.location}</span><p className="building-system">{building.system}</p><p>{building.summary}</p></div></article>)}</div>
        <div className="seo-content" style={{ marginTop: '2.5rem', maxWidth: 780 }}>
          <span className="eyebrow">Proyectos de referencia</span>
          <h3 style={{ marginTop: '0.5rem' }}>Experiencia en instalación de bombas de calor en edificios de Chile.</h3>
          <p style={{ marginTop: '0.8rem' }}>En <strong>Prosol Inversiones</strong> hemos participado en la <strong>instalación de bombas de calor</strong> en edificios residenciales, administraciones y comunidades de todo Chile. Cada proyecto de <strong>bomba de calor</strong> es distinto: varía la demanda de <strong>agua caliente sanitaria</strong>, la infraestructura existente, el espacio disponible y los objetivos de ahorro del comité.</p>
          <p style={{ marginTop: '0.8rem' }}>Nuestro primer hito fue el <strong>primer edificio de Chile en apagar sus calderas a gas</strong> e instalar una <strong>bomba de calor termodinámica</strong>. Desde entonces, hemos acumulado experiencia en <strong>dimensionamiento</strong>, <strong>puesta en marcha</strong> y <strong>seguimiento técnico</strong> de sistemas de agua caliente en copropiedades.</p>
          <p style={{ marginTop: '0.8rem' }}>Los proyectos que se muestran arriba ilustran el tipo de soluciones que podemos entregar. Para una evaluación real de su edificio, <a href="/contacto" style={{ textDecoration: 'underline', color: 'var(--navy)' }}>solicite una visita técnica</a> sin compromiso.</p>
        </div>
      </div>
    </section>
    <section className="section section-surface">
      <div className="container"><div className="section-heading"><span className="eyebrow">Voces de la comunidad</span><h2>Opiniones de clientes sobre bombas de calor en edificios.</h2></div><div className="testimonial-grid">{demoTestimonials.map((item) => <figure className="testimonial-card" key={item.id}><blockquote>{item.quote}</blockquote><figcaption>{item.role} · {item.id}</figcaption></figure>)}</div></div>
    </section>
    <CtaLevels compact />
  </>;
}
