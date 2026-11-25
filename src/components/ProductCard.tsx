import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategory, type Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="product-card">
      <Link href={`/producto/${product.slug}`} className="product-image" aria-label={`Ver ${product.name}`}>
        <Image src={product.image} alt={`Bomba de calor NAE ${product.name} - ${product.application}`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />
        <span className="product-category">{getCategory(product.category).name}</span>
      </Link>
      <div className="product-card-body">
        <span className="product-model">{product.model}</span>
        <h3><Link href={`/producto/${product.slug}`}>{product.shortName}</Link></h3>
        <p>{product.application}</p>
        <ul>{product.highlights.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>
        <Link className="text-link" href={`/producto/${product.slug}`}>Ver ficha técnica <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
