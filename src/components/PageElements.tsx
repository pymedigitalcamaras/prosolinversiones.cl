import Link from "next/link";
import { ChevronRight, FlaskConical } from "lucide-react";

export function PageHero({ eyebrow, title, intro, index }: { eyebrow: string; title: string; intro: string; index: string }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <div className="page-hero-intro"><span>{index}</span><p>{intro}</p></div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs container" aria-label="Migas de pan">
      <Link href="/">Inicio</Link>
      {items.map((item) => <span key={item.label}><ChevronRight size={14} aria-hidden="true" />{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}
    </nav>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="demo-notice" aria-label="Aviso de contenido demostrativo">
      <FlaskConical size={22} aria-hidden="true" />
      <div><strong>Contenido demostrativo</strong><p>{children ?? "Estos casos y testimonios son simulados, genéricos y no corresponden a clientes reales. Deben reemplazarse o retirarse antes de publicar el sitio."}</p></div>
    </aside>
  );
}
