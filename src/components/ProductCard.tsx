import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/content/products";
import { StatusBadge } from "./StatusBadge";
import { Icon } from "./Icon";

const categoryIcon: Record<string, string> = {
  "Business Management Software": "building",
  "Education Technology": "graduation",
  "SaaS Applications": "cloud",
  "E-commerce Solutions": "cart",
  "Developer Tools": "terminal",
  "Website and Application Templates": "template",
  "Custom Software": "code",
};

export function ProductCard({ product: p }: { product: Product }) {
  const buy = p.purchaseLinks?.[0];
  return (
    <article className="card product-card">
      <div className="product-card__head">
        {p.logo ? (
          <Image src={p.logo.src} alt={p.logo.alt} width={44} height={44} className="product-card__logo" />
        ) : (
          <span className="icon-tile" aria-hidden="true"><Icon name={categoryIcon[p.category] ?? "code"} /></span>
        )}
        <StatusBadge status={p.status} />
      </div>
      <p className="product-card__cat">{p.category}</p>
      <h3><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
      <p>{p.shortDescription}</p>
      <ul className="tick-list">
        {p.capabilities.slice(0, 3).map((c) => <li key={c}><Icon name="check" size={16} />{c}</li>)}
      </ul>
      <p className="product-card__aud"><strong>For:</strong> {p.audience.join(", ")}</p>
      <div className="product-card__actions">
        <Link className="btn btn--secondary btn--sm" href={`/products/${p.slug}`}>View details</Link>
        {buy && <a className="btn btn--primary btn--sm" href={buy.href} target="_blank" rel="noopener noreferrer">{buy.label}</a>}
      </div>
    </article>
  );
}
