import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, GraduationCap, Handshake, ShieldCheck } from "lucide-react";
import { CtaLevels } from "@/components/CtaLevels";
import { PageHero } from "@/components/PageElements";

export const metadata: Metadata = {
  title: "Nosotros · Venta e Instalación de Bombas de Calor en Chile",
  description: "Prosol Inversiones: más de 10 años vendiendo e instalando bombas de calor NAE para edificios y copropiedades. Departamento de ingeniería y asesoría técnica.",
  alternates: { canonical: "/nosotros" },
  keywords: ["Prosol Inversiones", "bomba de calor Chile", "instalación bombas de calor", "empresa bombas de calor"],
};

export default function AboutPage() {
  return <>
    <PageHero eyebrow="Por qué Prosol" title="Expertos en venta e instalación de bombas de calor NAE." intro="Prosol Inversiones SpA importa, vende e instala bombas de calor termodinámicas NAE y estanques inoxidables con evaluación técnica y acompañamiento para edificios." index="03 / NOSOTROS" />
    <section className="section">
      <div className="container editorial-grid"><div className="editorial-image"><Image src="/images/instalaciones/tecnicos.webp" alt="Técnicos de Prosol instalando bombas de calor en sala técnica" fill priority sizes="(max-width: 640px) 100vw, 50vw" /></div><div className="editorial-copy"><span className="eyebrow">Experiencia aplicada</span><h2>Instaladores de bombas de calor con respaldo técnico.</h2><p>Contamos con más de 10 años de experiencia vendiendo e instalando bombas de calor para edificios, departamento de ingeniería, exclusividad con proveedores y capacitación en China.</p><p>Ese respaldo nos permite conversar con administradores y comités desde las condiciones reales del edificio: consumo, infraestructura, espacio, continuidad operativa y mantenimiento de bombas de calor.</p><ol className="number-list"><li>Escuchar antes de recomendar una bomba de calor.</li><li>Explicar los supuestos antes de proyectar.</li><li>Acompañar después de la puesta en marcha.</li></ol></div></div>
    </section>
    <section className="section case-band"><div className="container case-grid"><div className="case-number"><strong>1.er</strong><span>edificio de Chile en apagar sus calderas a gas</span></div><div className="case-copy"><h2>Primer edificio de Chile en reemplazar calderas por bombas de calor.</h2><p>Esta experiencia respalda nuestro conocimiento en la instalación de bombas de calor. Cada nuevo proyecto se evalúa de manera independiente con sus propias condiciones técnicas y operativas.</p></div></div></section>
    <section className="section section-surface">
      <div className="container" style={{ maxWidth: 780 }}>
        <span className="eyebrow">Por qué elegir Prosol</span>
        <h2>Bombas de calor con respaldo técnico y experiencia comprobada.</h2>
        <div className="seo-content" style={{ display: 'grid', gap: '1.2rem', marginTop: '1.5rem' }}>
          <p>En <strong>Prosol Inversiones</strong> somos especialistas en <strong>bombas de calor termodinámicas</strong> para edificios y copropiedades. Nuestra trayectoria de más de 10 años nos ha permitido instalar <strong>bombas de calor NAE</strong> en decenas de comunidades, logrando <strong>ahorro energético</strong> significativo y mejorando la eficiencia de los sistemas de <strong>agua caliente sanitaria ACS</strong>.</p>
          <p>Contamos con un <strong>departamento de ingeniería propio</strong> que dimensiona cada proyecto de <strong>bomba de calor</strong> según las condiciones específicas del edificio: número de departamentos, consumo de agua caliente, sistema existente y espacio disponible en la sala técnica o azotea.</p>
          <p>Nuestros técnicos reciben <strong>capacitación directa con los fabricantes</strong> en China, lo que nos permite ofrecer un servicio de <strong>instalación de bombas de calor</strong> con los más altos estándares técnicos del mercado.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
            <Link className="button button-dark" href="/catalogo">Ver catálogo de bombas de calor <ArrowRight size={18} /></Link>
            <Link className="button button-outline" href="/contacto">Solicitar evaluación técnica</Link>
          </div>
        </div>
      </div>
    </section>
    <section className="section">
      <div className="container"><div className="section-heading"><span className="eyebrow">Nuestra forma de trabajar</span><h2>Venta, instalación y servicio técnico de bombas de calor.</h2></div><div className="audience-grid">
        <article className="audience-card"><GraduationCap size={28} color="#b66f00" /><span>CAPACIDAD</span><h3>Ingeniería y aprendizaje continuo</h3><p>Capacitación en China y conocimiento técnico para distinguir una bomba de calor de una caldera y diseñar el sistema completo.</p></article>
        <article className="audience-card"><ShieldCheck size={28} color="#b66f00" /><span>RESPALDO</span><h3>Proveedores y continuidad</h3><p>Exclusividad con proveedores, equipamiento NAE y seguimiento Prosol según el alcance acordado para cada proyecto.</p></article>
        <article className="audience-card"><Handshake size={28} color="#b66f00" /><span>RELACIÓN</span><h3>Una conversación que continúa</h3><p>Administradores, comités y asesores participan con información clara y un canal directo para resolver cada etapa.</p></article>
      </div></div>
    </section>
    <section className="split-feature"><div className="split-feature-content"><span className="eyebrow">Inversión y ahorro</span><h2>Retorno de inversión en bombas de calor para edificios.</h2><p>La inversión en una bomba de calor puede analizarse en relación con el ahorro estimado. El resultado depende del sistema existente, el consumo, las tarifas y las condiciones del edificio.</p><ul className="check-list"><li><Check size={18} />Ahorro comunicable de hasta 50 % con bombas de calor.</li><li><Check size={18} />Caso de referencia con 46,2 % de ahorro anual.</li><li><Check size={18} />Supuestos explícitos para la decisión del comité.</li></ul><Link className="button button-outline" href="/contacto?perfil=comite">Pedir antecedentes<ArrowRight size={18} /></Link></div><div className="split-feature-image"><Image src="/images/instalaciones/instalacion-acs.webp" alt="Estanques y bombas de calor instalados en azotea de edificio" fill sizes="(max-width: 900px) 100vw, 50vw" /></div></section>
    <CtaLevels compact />
  </>;
}
