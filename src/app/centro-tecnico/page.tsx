import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, MonitorCheck, Wrench } from "lucide-react";
import { CtaLevels } from "@/components/CtaLevels";
import { DemoNotice, PageHero } from "@/components/PageElements";
import { demoTechnicalConfirmations } from "@/lib/demo-content";
import { technicalArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Centro Técnico · Dimensionamiento e Instalación Bombas de Calor",
  description: "Dimensionamiento técnico, instalación, monitoreo y servicio post-venta de bombas de calor NAE para edificios y copropiedades en Chile.",
  alternates: { canonical: "/centro-tecnico" },
  keywords: ["dimensionamiento bomba de calor", "instalación bomba de calor", "servicio técnico bomba de calor", "monitoreo bombas de calor"],
};

export default function TechnicalPage() {
  return <>
    <PageHero eyebrow="Centro técnico y monitoreo" title="Dimensionamiento e instalación profesional de bombas de calor." intro="Una instalación correcta de bomba de calor requiere dimensionamiento técnico, acumulación, control y operación adecuada. Servicio especializado para edificios." index="04 / TÉCNICA" />
    <section className="section"><div className="container editorial-grid"><div className="editorial-copy"><span className="eyebrow">Diagnóstico en terreno</span><h2>Instalación de bombas de calor: evite errores comunes.</h2><p>En las visitas a edificios detectamos equipos instalados como si fueran calderas, confusiones entre calefacción y agua caliente sanitaria, y sistemas que no aprovechan la acumulación o recirculación.</p><p>Prosol revisa el funcionamiento antes de instalar una bomba de calor. El objetivo es que el equipo, el estanque, la hidráulica y los controles trabajen como una sola solución.</p><Link className="text-link" href="/contacto">Solicitar una revisión técnica <ArrowRight size={17} /></Link></div><div className="editorial-image"><Image src="/images/instalaciones/esquema-sistema.webp" alt="Esquema técnico de instalación de bombas de calor y estanques de acumulación" fill priority sizes="(max-width: 640px) 100vw, 50vw" /></div></div></section>
    <section className="section section-surface"><div className="container"><div className="section-heading"><span className="eyebrow">Método Prosol</span><h2>Proceso de instalación de bombas de calor en edificios.</h2></div><div className="process-grid">
      <article className="process-step"><span>01</span><h3>Levantamiento</h3><p>Demanda, sistema actual, consumo, espacio, condiciones eléctricas e hidráulicas.</p></article>
      <article className="process-step"><span>02</span><h3>Dimensionamiento</h3><p>Selección de equipos, acumulación, recirculación y estrategia de operación.</p></article>
      <article className="process-step"><span>03</span><h3>Puesta en marcha</h3><p>Montaje, controles, verificación y explicación al equipo del edificio.</p></article>
      <article className="process-step"><span>04</span><h3>Seguimiento</h3><p>Revisión del funcionamiento y escalamiento técnico según el servicio acordado.</p></article>
    </div></div></section>
    <section className="split-feature"><div className="split-feature-image"><Image src="/images/instalaciones/azotea.webp" alt="Sistema de bombas de calor NAE en operación en edificio" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="split-feature-content"><span className="eyebrow">Monitoreo, cuando el sistema lo permite</span><h2>Monitoreo remoto de bombas de calor en edificios.</h2><p>Cuando el edificio cuenta con equipamiento compatible, conectividad en la sala técnica y el servicio contratado, el monitoreo permite revisar reportes del sistema sin depender solo de inspecciones presenciales.</p><ul className="check-list"><li><MonitorCheck size={18} />Revisión remota de parámetros de la bomba de calor.</li><li><Activity size={18} />Detección y análisis de anomalías.</li><li><Wrench size={18} />Asesoría a distancia y visita si no basta.</li></ul><p><small>La disponibilidad de datos depende de los equipos instalados, la conectividad y el alcance contratado.</small></p></div></section>
    <section className="section section-surface">
      <div className="container" style={{ maxWidth: 780 }}>
        <span className="eyebrow">Dimensionamiento técnico</span>
        <h2>¿Por qué el dimensionamiento correcto es clave en una bomba de calor?</h2>
        <div className="seo-content" style={{ display: 'grid', gap: '1.2rem', marginTop: '1.5rem' }}>
          <p>El <strong>dimensionamiento de una bomba de calor</strong> no es un cálculo estándar: depende de la demanda de <strong>agua caliente sanitaria</strong>, la cantidad de departamentos, los hábitos de consumo, la climatología local y las condiciones del sistema hidráulico existente. Una <strong>bomba de calor</strong> mal dimensionada puede generar insuficiencia en horarios pico o consumir más energía de la necesaria.</p>
          <p>En Prosol realizamos un <strong>levantamiento técnico completo</strong> antes de proponer cualquier solución. Evaluamos el espacio disponible para la <strong>instalación de la bomba de calor</strong>, la capacidad eléctrica del edificio, el estado de los estanques de acumulación y la red de recirculación. Solo con esos antecedentes podemos recomendar el modelo de <strong>bomba de calor NAE</strong> adecuado.</p>
          <p>La <strong>eficiencia energética</strong> de una instalación correctamente dimensionada se mantiene en el tiempo. Por eso nuestro servicio incluye no solo la <strong>instalación de la bomba de calor</strong>, sino también la puesta en marcha, capacitación al personal del edificio y un plan de seguimiento técnico.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
            <Link className="button button-dark" href="/contacto?perfil=administrador">Solicitar revisión técnica <ArrowRight size={18} /></Link>
            <Link className="button button-outline" href="/catalogo">Ver equipos NAE</Link>
          </div>
        </div>
      </div>
    </section>
    <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Protocolo ante una anomalía</span><h2>Servicio técnico especializado para bombas de calor.</h2></div><div className="timeline">
      <article className="timeline-item"><h3>1. Revisión del antecedente</h3><p>Se analiza la alerta o el reporte junto con los antecedentes disponibles del sistema.</p></article>
      <article className="timeline-item"><h3>2. Contacto con el edificio</h3><p>El equipo Prosol se comunica con las personas designadas para confirmar condiciones y síntomas.</p></article>
      <article className="timeline-item"><h3>3. Orientación a distancia</h3><p>Cuando es seguro y posible, se entregan instrucciones o se revisan parámetros remotamente.</p></article>
      <article className="timeline-item"><h3>4. Visita técnica</h3><p>Si la anomalía no puede resolverse a distancia, se coordina la atención en el edificio.</p></article>
    </div></div></section>
    <section className="section section-surface"><div className="container"><div className="section-heading"><span className="eyebrow">Confirmaciones de operacion</span><h2>El equipo del edificio ante el sistema de bomba de calor.</h2></div><div className="testimonial-grid">{demoTechnicalConfirmations.map((item) => <figure className="testimonial-card" key={item.id}><blockquote>{item.quote}</blockquote><figcaption>{item.role} · {item.id}</figcaption></figure>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><span className="eyebrow">Biblioteca técnica</span><h2>Antecedentes para conversar con su comunidad.</h2><p>Artículos indexables, con autor, fecha y fuentes identificadas.</p></div><div className="audience-grid">{technicalArticles.map((article, index) => <article className="audience-card" key={article.slug}><span>0{index + 1} / ARTÍCULO</span><h3>{article.title}</h3><p>{article.description}</p><Link href={`/centro-tecnico/${article.slug}`}>Leer artículo <ArrowRight size={16} /></Link></article>)}</div></div></section>
    <CtaLevels compact />
  </>;
}
