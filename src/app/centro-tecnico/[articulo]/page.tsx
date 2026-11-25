import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaLevels } from "@/components/CtaLevels";
import { Breadcrumbs } from "@/components/PageElements";
import { getTechnicalArticle, technicalArticles } from "@/lib/articles";
import { site } from "@/lib/site";

export function generateStaticParams() { return technicalArticles.map((article) => ({ articulo: article.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ articulo: string }> }): Promise<Metadata> {
  const { articulo } = await params;
  const article = getTechnicalArticle(articulo);
  if (!article) return { title: "Artículo no encontrado" };
  return { title: article.title, description: article.description, alternates: { canonical: `/centro-tecnico/${article.slug}` }, openGraph: { type: "article", title: article.title, description: article.description, publishedTime: "2026-10-26" } };
}

export default async function TechnicalArticlePage({ params }: { params: Promise<{ articulo: string }> }) {
  const { articulo } = await params;
  const article = getTechnicalArticle(articulo);
  if (!article) notFound();
  const schema = { "@context": "https://schema.org", "@type": "TechArticle", headline: article.title, description: article.description, datePublished: "2026-10-26", dateModified: "2026-10-26", author: { "@type": "Organization", name: site.legalName }, publisher: { "@id": `${site.url}/#organizacion` }, mainEntityOfPage: `${site.url}/centro-tecnico/${article.slug}` };
  return <>
    <Breadcrumbs items={[{ label: "Centro técnico", href: "/centro-tecnico" }, { label: article.eyebrow }]} />
    <article className="article-page">
      <header className="article-header"><div className="container"><span className="eyebrow">{article.eyebrow}</span><h1>{article.title}</h1><p>{article.description}</p><div className="article-meta"><span>Por {site.legalName}</span><time dateTime="2026-10-26">26 de octubre de 2026</time></div></div></header>
      <div className="container article-layout"><aside><Link href="/centro-tecnico"><ArrowLeft size={16} />Volver al centro técnico</Link><div><strong>En este artículo</strong>{article.sections.map((section, index) => <a key={section.heading} href={`#seccion-${index + 1}`}>{section.heading}</a>)}</div></aside><div className="article-body">{article.sections.map((section, index) => <section id={`seccion-${index + 1}`} key={section.heading}><span>0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<div className="article-source"><strong>Fuente y alcance</strong><p>{article.source}</p><p>Contenido informativo. La recomendación para un edificio requiere evaluación técnica.</p></div><Link className="button" href="/contacto">Conversar sobre mi edificio<ArrowRight size={17} /></Link></div></div>
    </article>
    <CtaLevels compact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}
