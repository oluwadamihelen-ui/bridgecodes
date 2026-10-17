import Link from "next/link";
import { PageHero } from "./PageHero";
import { EnquiryForm } from "./EnquiryForm";
import { StatusBadge } from "./StatusBadge";
import { productStatuses, type Product } from "@/content/products";
import { site } from "@/config/site";

/** Shared layout for the per-product "enquire to purchase" and "request a demo" pages. */
export function ProductEnquiryPage({ product: p, kind }: { product: Product; kind: "purchase" | "demo" }) {
  const available = p.status === "available";
  const title =
    kind === "demo" ? `Request a demo of ${p.name}` : available ? `Enquire to purchase ${p.name}` : `Ask about ${p.name}`;
  const intro =
    kind === "demo"
      ? "Tell us what you would like to see or try, and we will get in touch about arranging a demo or trial."
      : available
        ? "Tell us what you need and we will reply by email with licensing, pricing and how to buy."
        : `${p.name} is currently ${productStatuses[p.status].toLowerCase()}. Leave your details and we will follow up with you about availability.`;
  const label = kind === "demo" ? "Request a demo" : available ? "Purchase enquiry" : "Availability";

  return (
    <>
      <PageHero
        title={title}
        intro={intro}
        crumbs={[
          { name: "Products", path: "/products" },
          { name: p.name, path: `/products/${p.slug}` },
          { name: label, path: `/products/${p.slug}/${kind}` },
        ]}
      />
      <section className="section">
        <div className="container two-col">
          <EnquiryForm
            kind={kind}
            turnstileSiteKey={site.turnstileSiteKey}
            fixed={{ product: p.name, subject: `${kind === "demo" ? "Demo request" : "Purchase enquiry"}: ${p.name}` }}
          />
          <aside className="aside-card" aria-label="About this product" style={{ position: "static" }}>
            <h2 style={{ fontSize: "1.15rem" }}>{p.name}</h2>
            <p>{p.shortDescription}</p>
            <dl>
              <div><dt>Status</dt><dd><StatusBadge status={p.status} /></dd></div>
              <div><dt>Price</dt><dd>{p.pricing?.display ?? "Contact us"}</dd></div>
              <div><dt>Sold by</dt><dd>{site.legalOwner}</dd></div>
            </dl>
            {kind === "purchase" && (
              <p className="hint">
                Before you buy, see our <Link href="/license-agreement">License Agreement</Link>,{" "}
                <Link href="/refund-policy">Refund Policy</Link> and <Link href="/terms-of-service">Terms of Service</Link>.
              </p>
            )}
            <Link className="btn btn--secondary" style={{ marginTop: 12 }} href={`/products/${p.slug}`}>Back to product</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
