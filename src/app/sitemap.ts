import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import { technicalArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/experiencia", "/nosotros", "/centro-tecnico", "/contacto", "/privacidad", "/cookies", "/derechos-arsop"];
  const today = new Date("2026-11-21");
  return [
    ...routes.map((route) => ({ url: `${site.url}${route}`, lastModified: today, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : route === "/catalogo" || route === "/contacto" ? .9 : .6 })),
    ...products.map((product) => ({ url: `${site.url}/producto/${product.slug}`, lastModified: today, changeFrequency: "monthly" as const, priority: .8 })),
    ...technicalArticles.map((article) => ({ url: `${site.url}/centro-tecnico/${article.slug}`, lastModified: today, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
