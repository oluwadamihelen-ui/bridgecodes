import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/content/products";
import { StatusBadge } from "./StatusBadge";
import { ImageCarousel } from "./ImageCarousel";
import { Icon } from "./Icon";
import { isInternalHref } from "@/lib/links";

const categoryIcon: Record<string, string> = {
  "Business Management Software": "building",
  "Education Technology": "graduation",
  "SaaS Applications": "cloud",
  "E-commerce Solutions": "cart",
  "Developer Tools": "terminal",
  "Website and Application Templates": "template",
  "Custom Software": "code",
};

export function ProductCard({ product: p, featured = false }: { product: Product; featured?: boolean }) {
  const buy = p.paymentLink && p.status === "available"
    ? { label: "Buy now", href: `/products/${p.slug}/checkout` }
    : p.purchaseLinks?.[0];
  const shots = p.screenshots ?? [];
  const audience = p.audience.slice(0, 2).join(", ") + (p.audience.length > 2 ? ` +${p.audience.length - 2} more` : "");

  return (
    <article className={`card product-card${featured ? " product-card--featured" : ""}`}>
      <div className="product-card__media">
        {shots.length > 0 ? (
          <ImageCarousel
            images={shots}
            label={`${p.name} screenshots`}
            sizes={featured ? "(max-width: 860px) 100vw, 560px" : "(max-width: 680px) 100vw, (max-width: 1020px) 50vw, 380px"}
          />
        ) : (
          <div className="product-card__placeholder" aria-hidden="true">
            {p.logo ? (
              <Image src={p.logo.src} alt="" width={p.logo.width ?? 160} height={p.logo.height ?? 44} sizes="200px" className="product-card__placeholder-logo" />
            ) : (
              <Icon name={categoryIcon[p.category] ?? "code"} size={48} />
            )}
          </div>
        )}
        <span className="product-card__status"><StatusBadge status={p.status} /></span>
      </div>

      <div className="product-card__body">
        {p.logo && shots.length > 0 && (
          <Image src={p.logo.src} alt={p.logo.alt} width={p.logo.width ?? 160} height={p.logo.height ?? 44} sizes="170px" className="product-card__logo" />
        )}
        <p className="product-card__cat">{p.category}</p>
        <h3><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
        <p className="product-card__desc">{p.shortDescription}</p>
        <Link className="link-arrow product-card__more" href={`/products/${p.slug}`}>
          View more <Icon name="arrow" size={15} /><span className="sr-only"> about {p.name}</span>
        </Link>
        <ul className="tick-list">
          {p.capabilities.slice(0, 3).map((c) => <li key={c}><Icon name="check" size={16} />{c}</li>)}
        </ul>
        <p className="product-card__aud"><strong>For:</strong> {audience}</p>
        <div className="product-card__actions">
          <Link className="btn btn--secondary btn--sm" href={`/products/${p.slug}`}>View details</Link>
          {buy && (isInternalHref(buy.href)
            ? <Link className="btn btn--primary btn--sm" href={buy.href}>{buy.label}</Link>
            : <a className="btn btn--primary btn--sm" href={buy.href} target="_blank" rel="noopener noreferrer">{buy.label}</a>)}
        </div>
      </div>
    </article>
  );
}

/** Responsive grid; a lone product gets the wide "featured" layout. */
export function ProductGrid({ products }: { products: Product[] }) {
  const single = products.length === 1;
  return (
    <div className={single ? "product-grid product-grid--single" : "grid grid--3"}>
      {products.map((p) => <ProductCard key={p.slug} product={p} featured={single} />)}
    </div>
  );
}
