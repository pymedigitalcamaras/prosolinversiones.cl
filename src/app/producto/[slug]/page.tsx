import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { CtaLevels } from "@/components/CtaLevels";
import { Breadcrumbs } from "@/components/PageElements";
import { ProductCard } from "@/components/ProductCard";
import { getCategory, getProduct, productBenefits, products } from "@/lib/products";
import { site, whatsappUrl } from "@/lib/site";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Bomba de calor no encontrada" };
  return {
    title: `${product.shortName} · ${product.model} | Bomba de Calor NAE`,
    description: `${product.name} NAE. ${product.application}. Ficha técnica, especificaciones y cotización de bomba de calor para su edificio.`,
    alternates: { canonical: `/producto/${product.slug}` },
    keywords: ["bomba de calor NAE", product.shortName.toLowerCase(), "bomba de calor Chile", "bomba de calor precio"],
    openGraph: { title: `${product.name} | Bomba de Calor NAE`, description: product.description, images: [{ url: product.image, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
  const schema = {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, model: product.model, description: product.description,
    image: product.gallery!.map((image) => `${site.url}${image}`), url: `${site.url}/producto/${product.slug}`,
    category: getCategory(product.category).name, brand: { "@type": "Brand", name: product.category === "acumulacion" ? "Prosol" : "NAE" },
    additionalProperty: product.specs.map((spec) => ({ "@type": "PropertyValue", name: spec.label, value: spec.value })),
  };

  return <>
    <Breadcrumbs items={[{ label: "Catálogo", href: "/catalogo" }, { label: product.shortName }]} />
    <section className="section-small">
      <div className="container product-detail">
        <div className="product-detail-image"><div className="product-main-image"><Image src={product.image} alt={`${product.name}, modelo ${product.model}`} fill priority sizes="(max-width: 900px) 100vw, 50vw" /></div>{product.gallery!.length > 1 && <div className="product-gallery">{product.gallery!.map((image, index) => <div key={image}><Image src={image} alt={`Vista ${index + 1} de ${product.shortName}`} fill sizes="90px" /></div>)}</div>}</div>
        <div className="product-detail-copy"><span className="eyebrow">{getCategory(product.category).name}</span><span className="product-model">MODELO / {product.model}</span><h1>{product.shortName}</h1><p className="lead">{product.description}</p><div className="product-application">{product.application}</div><div className="product-highlights">{product.highlights.map((item) => <div key={item}>{item}</div>)}</div><div className="product-actions"><a className="button" href={whatsappUrl(`Hola, Prosol. Quisiera evaluar ${product.name}, modelo ${product.model}, para un edificio.`)} target="_blank" rel="noreferrer"><MessageCircle size={18} />Consultar por este equipo</a><Link className="button button-outline-dark" href="/contacto">Solicitar evaluación</Link></div><p className="technical-note">Fuente técnica: {product.sourcePage}. Imagen referencial del catálogo. La selección y compatibilidad deben validarse para cada proyecto.</p></div>
      </div>
    </section>
    <section className="section section-surface">
      <div className="container specs-layout"><div><span className="eyebrow">Especificaciones</span><h2>Datos para una conversación técnica.</h2><p>Estos antecedentes permiten una primera revisión. El dimensionamiento final considera la operación real del sistema.</p></div><div><table className="specs-table"><caption className="sr-only">Especificaciones de {product.name}</caption><tbody>{product.specs.map((spec) => <tr key={spec.label}><th scope="row">{spec.label}</th><td>{spec.value}</td></tr>)}</tbody></table></div></div>
    </section>
    <section className="section">
      <div className="container editorial-grid"><div><span className="eyebrow">Aplicación e implementación</span><h2>El equipo es una parte del sistema.</h2><p>Prosol acompaña la evaluación, el montaje, la puesta en marcha y el seguimiento según el alcance acordado para cada proyecto.</p><Link className="text-link" href="/centro-tecnico">Revisar el enfoque técnico →</Link></div><ul className="check-list">{productBenefits(product).map((benefit) => <li key={benefit}><Check size={18} />{benefit}</li>)}</ul></div>
    </section>
    {related.length > 0 && <section className="section section-surface"><div className="container"><div className="section-heading-row"><div className="section-heading"><span className="eyebrow">Misma familia</span><h2>Otras alternativas.</h2></div><Link className="text-link" href="/catalogo"><ArrowLeft size={16} />Volver al catálogo</Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.slug} product={item} />)}</div></div></section>}
    <CtaLevels compact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </>;
}
