import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardCheck, Clock3, MessageCircle } from "lucide-react";
import { HeroSlider, SlideData } from "@/components/HeroSlider";
import { CtaLevels } from "@/components/CtaLevels";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import { demoBuildings, demoTestimonials } from "@/lib/demo-content";
import { faqs, site, whatsappUrl } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase";

const familyImages: Record<string, string> = {
  "acs-horizontal": "/images/productos/catalogo-04.webp",
  "acs-vertical": "/images/productos/catalogo-06.webp",
  piscina: "/images/productos/catalogo-08.webp",
  climatizacion: "/images/productos/catalogo-10.webp",
  acumulacion: "/images/productos/catalogo-14.webp",
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

async function getSlides(): Promise<SlideData[]> {
  const { data } = await supabaseAdmin
    .from("slides")
    .select("image, alt, eyebrow, title, text, href, action")
    .order("sort_order", { ascending: true });
  return (data || []) as SlideData[];
}

export default async function Home() {
  const slides = await getSlides();

  return (
    <>
      <HeroSlider slides={slides.length > 0 ? slides : undefined} />
      <section className="quick-contact" aria-label="Contacto y evaluación técnica">
        <div className="container quick-contact-grid">
          <a className="quick-item quick-item--whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer">
            <div className="quick-icon">
              <MessageCircle size={24} aria-hidden="true" />
            </div>
            <div className="quick-text">
              <strong>Conversemos por WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></strong>
              <p>{site.phoneDisplay} · {site.responseTime}</p>
            </div>
          </a>
          <Link className="quick-item quick-item--eval" href="/contacto">
            <div className="quick-icon">
              <ClipboardCheck size={24} aria-hidden="true" />
            </div>
            <div className="quick-text">
              <strong>Solicite una evaluación <ArrowRight size={15} aria-hidden="true" /></strong>
              <p>Antecedentes técnicos para su edificio o comité.</p>
            </div>
          </Link>
          <div className="quick-item quick-item--hours">
            <div className="quick-icon">
              <Clock3 size={24} aria-hidden="true" />
            </div>
            <div className="quick-text">
              <strong>Horario y cobertura</strong>
              <p>{site.hours} · {site.coverage}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-small">
        <div className="container metrics">
          <div className="metric"><strong>10+</strong><span>años en eficiencia energética</span><small>Experiencia y capacitación en China.</small></div>
          <div className="metric"><strong>50%</strong><span>ahorro máximo comunicable</span><small>Según condiciones de cada edificio.</small></div>
          <div className="metric"><strong>46,2%</strong><span>ahorro anual en un caso de referencia</span><small>Antecedente específico, no garantía universal.</small></div>
          <div className="metric"><strong>1.er</strong><span>edificio de Chile en apagar calderas a gas</span><small>Experiencia aprobada para comunicación.</small></div>
        </div>
      </section>

      <section className="section" aria-labelledby="families-title">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Catálogo de bombas de calor</span><h2 id="families-title">Catálogo de bombas de calor NAE para agua caliente sanitaria.</h2><p>Doce soluciones de bombas de calor termodinámicas y estanques de acumulación. Cada equipo se dimensiona según la demanda de su edificio.</p></div>
          <div className="family-grid">
            {categories.filter((category) => category.id !== "todos").map((category, index) => <Link className="family-card" href={`/catalogo?categoria=${category.id}`} key={category.id}>
              <Image src={familyImages[category.id]} alt={`Bomba de calor NAE ${category.name} para ${category.description}`} fill sizes="(max-width: 640px) 100vw, 25vw" />
              <div className="family-card-content"><span>0{index + 1}</span><h3>{category.name}</h3><p>{category.description}</p></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="split-feature">
        <div className="split-feature-image"><Image src="/images/instalaciones/azotea.webp" alt="Tres bombas de calor NAE instaladas en azotea de edificio residencial" fill sizes="(max-width: 900px) 100vw, 55vw" /></div>
        <div className="split-feature-content"><span className="eyebrow">Ingeniería antes que equipamiento</span><h2>Venta e instalación de bombas de calor con diseño a medida.</h2><p>Una bomba de calor termodinámica exige un enfoque distinto al de una caldera. La acumulación, la recirculación y la puesta en marcha son parte del resultado.</p><ul className="check-list"><li><Check size={18} />Evaluación del consumo y del sistema existente.</li><li><Check size={18} />Dimensionamiento técnico de bombas de calor.</li><li><Check size={18} />Montaje, puesta en marcha y seguimiento Prosol.</li></ul><Link className="button button-outline" href="/centro-tecnico">Conocer el centro técnico<ArrowRight size={18} /></Link></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading-row"><div className="section-heading"><span className="eyebrow">Selección técnica</span><h2>Bombas de calor NAE para distintas demandas de ACS.</h2><p>Especificaciones técnicas verificadas de bombas de calor horizontales, verticales y estanques de acumulación.</p></div><Link className="text-link" href="/catalogo">Ver las 12 fichas técnicas <ArrowUpRight size={17} /></Link></div>
          <div className="product-grid">{[products[2], products[4], products[11]].map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </div>
      </section>

      <section className="section case-band">
        <div className="container case-grid"><div className="case-number"><strong>46,2%</strong><span>de ahorro anual en un caso de referencia</span></div><div className="case-copy"><h2>Ahorro energético con bombas de calor en edificios.</h2><p>El ahorro comunicable con bombas de calor termodinámicas puede llegar hasta 50 % según el sistema previo, la demanda, las condiciones del edificio y el diseño de la solución. Analizamos la inversión en relación con el ahorro estimado.</p><small>El 46,2 % corresponde a un antecedente específico aprobado para comunicación. No incluye datos identificables del condominio y no asegura el mismo resultado en otros edificios.</small></div></div>
      </section>

      <section className="section section-surface">
        <div className="container">
          <div className="section-heading"><span className="eyebrow">Expertos en bombas de calor</span><h2>Bomba de calor termodinámica de 3ra generación para edificios.</h2></div>
          <div className="seo-content" style={{ display: 'grid', gap: '1.2rem', maxWidth: '780px' }}>
            <p>Las <strong>bombas de calor termodinámicas</strong> representan la tecnología más eficiente para producir <strong>agua caliente sanitaria ACS</strong> en edificios y copropiedades. A diferencia de las calderas tradicionales que queman combustible, una <strong>bomba de calor</strong> extrae calor del ambiente para calentar el agua, logrando un <strong>ahorro energético</strong> significativo.</p>
            <p>En <strong>Prosol Inversiones</strong> nos especializamos en la <strong>venta e instalación de bombas de calor NAE</strong>, equipos de <strong>3ra generación</strong> diseñados específicamente para las demandas de <strong>edificios residenciales y comunidades</strong> en Chile. Nuestro departamento de ingeniería dimensiona cada <strong>bomba de calor</strong> según las condiciones reales del edificio.</p>
            <p>La <strong>eficiencia energética</strong> de una <strong>bomba de calor</strong> se mide por su COP (Coeficiente de Rendimiento). Las unidades NAE que comercializamos alcanzan COP superiores a 4, lo que significa que por cada kWh de electricidad consumido, se generan más de 4 kWh de calor útil para el <strong>sistema de agua caliente sanitaria</strong>.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><div className="section-heading"><span className="eyebrow">Cierre en tres niveles</span><h2>Bombas de calor para administradores, comités y asesores.</h2></div><div className="audience-grid">
          <article className="audience-card"><span>01 / ADMINISTRAR</span><h3>Continuidad para su edificio</h3><p>Revise el estado del sistema, los riesgos operativos y la alternativa técnica antes de presentar una decisión.</p><Link href="/contacto?perfil=administrador">Solicitar evaluación <ArrowRight size={16} /></Link></article>
          <article className="audience-card"><span>02 / DECIDIR</span><h3>Antecedentes para su comité</h3><p>Reciba una explicación clara del alcance, los supuestos y las condiciones para una conversación informada.</p><Link href="/contacto?perfil=comite">Pedir antecedentes <ArrowRight size={16} /></Link></article>
          <article className="audience-card"><span>03 / ASESORAR</span><h3>Un canal para crear oportunidades</h3><p>Aporte soluciones a las comunidades que asesora dentro de una relación comercial legítima.</p><Link href="/contacto?perfil=asesor">Conocer el canal <ArrowRight size={16} /></Link></article>
        </div></div>
      </section>

      <section className="section section-surface">
        <div className="container"><div className="section-heading-row"><div className="section-heading"><span className="eyebrow">Experiencia</span><h2>Proyectos de instalación de bombas de calor en edificios.</h2></div><Link className="text-link" href="/experiencia">Ver experiencia en bombas de calor <ArrowUpRight size={17} /></Link></div><div className="building-grid">{demoBuildings.slice(0, 3).map((building) => <article className="building-card" key={building.id}><div className="building-image"><Image src={building.image} alt={`Instalación de bomba de calor NAE en ${building.name} - ${building.system}`} fill sizes="(max-width: 640px) 100vw, 33vw" /></div><div className="building-body"><h3>{building.name}</h3><span className="building-location">{building.location}</span><p className="building-system">{building.system}</p><p>{building.summary}</p></div></article>)}</div></div>
      </section>

      <section className="section">
        <div className="container"><div className="section-heading"><span className="eyebrow">Voces de la comunidad</span><h2>Opiniones sobre bombas de calor en copropiedades.</h2></div><div className="testimonial-grid">{demoTestimonials.slice(0, 3).map((item) => <figure className="testimonial-card" key={item.id}><blockquote>{item.quote}</blockquote><figcaption>{item.role} · {item.id}</figcaption></figure>)}</div></div>
      </section>

      <section className="section section-surface">
        <div className="container faq-layout"><div className="section-heading"><span className="eyebrow">Preguntas frecuentes</span><h2>Preguntas frecuentes sobre bombas de calor en edificios.</h2><p>Si su pregunta depende de las condiciones del edificio, la evaluación técnica de bomba de calor es el siguiente paso.</p><a className="button button-dark" href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={17} />Consultar por WhatsApp</a></div><div className="faq-list">{faqs.map((item, index) => <details key={item.question} open={index === 0}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div>
      </section>

      <CtaLevels />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
