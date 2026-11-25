import type { Metadata } from "next";
import Link from "next/link";
import { CtaLevels } from "@/components/CtaLevels";
import { PageHero } from "@/components/PageElements";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo de Bombas de Calor NAE | ACS · Piscinas · Climatización",
  description: "Catálogo técnico de bombas de calor NAE para agua caliente sanitaria ACS, piscinas, climatización all-in-one y estanques de acumulación inoxidable. Venta e instalación en Chile.",
  alternates: { canonical: "/catalogo" },
  keywords: ["catálogo bombas de calor", "bomba de calor NAE", "bomba de calor ACS", "bomba de calor precio Chile", "estanques inoxidables"],
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const selected = categories.some((item) => item.id === categoria) ? categoria : "todos";
  const visible = selected === "todos" ? products : products.filter((product) => product.category === selected);

  return <>
    <PageHero eyebrow="Catálogo de bombas de calor" title="Catálogo de bombas de calor NAE para agua caliente sanitaria." intro="Explore bombas de calor horizontales, verticales, all-in-one y estanques de acumulación. La selección definitiva requiere evaluación técnica de su edificio." index="01 / CATÁLOGO" />
    <section className="section">
      <div className="container">
        <div className="catalog-toolbar"><p><strong>{visible.length}</strong> {visible.length === 1 ? "solución" : "soluciones"} en esta vista</p><span className="tag">Catálogo público sin precios</span></div>
        <nav className="catalog-filters" aria-label="Filtrar catálogo por familia">{categories.map((category) => <Link key={category.id} className={selected === category.id ? "active" : ""} href={category.id === "todos" ? "/catalogo" : `/catalogo?categoria=${category.id}`}>{category.name}</Link>)}</nav>
        <div className="product-grid">{visible.map((product, index) => <ProductCard key={product.slug} product={product} priority={index < 3} />)}</div>
        <div className="catalog-note"><strong>La ficha técnica no reemplaza el dimensionamiento.</strong><p>Las capacidades, superficies y aplicaciones son antecedentes del catálogo. Prosol debe revisar la demanda, el espacio, la infraestructura y las condiciones de operación antes de recomendar un equipo.</p></div>
        <div className="seo-content" style={{ marginTop: '2.5rem', maxWidth: 780 }}>
          <span className="eyebrow">Guía de compra</span>
          <h3 style={{ marginTop: '0.5rem' }}>¿Cómo elegir la bomba de calor adecuada para su edificio?</h3>
          <p style={{ marginTop: '0.8rem' }}>Elegir una <strong>bomba de calor</strong> no es solo comparar potencias. En <strong>Prosol Inversiones</strong> consideramos el tipo de edificio, la cantidad de unidades, el consumo estimado de <strong>agua caliente sanitaria</strong>, el clima de la zona y el espacio disponible para la instalación. Las <strong>bombas de calor horizontales</strong> son ideales para azoteas con espacio, mientras que las <strong>verticales</strong> se adaptan mejor a salas técnicas reducidas.</p>
          <p style={{ marginTop: '0.8rem' }}>Los sistemas <strong>all-in-one</strong> integran bomba de calor, estanque y controles en una sola unidad, simplificando la instalación. Los <strong>estanques de acumulación inoxidables</strong> complementan cualquier solución garantizando reserva térmica para picos de demanda en la copropiedad.</p>
          <p style={{ marginTop: '0.8rem' }}>Todas nuestras <strong>bombas de calor NAE</strong> son de <strong>3ra generación</strong>, con refrigerante ecológico y control inteligente. Solicite una <Link href="/contacto" style={{ textDecoration: 'underline', color: 'var(--navy)' }}>evaluación técnica gratuita</Link> para recibir una propuesta dimensionada para su edificio.</p>
        </div>
      </div>
    </section>
    <CtaLevels compact />
  </>;
}
