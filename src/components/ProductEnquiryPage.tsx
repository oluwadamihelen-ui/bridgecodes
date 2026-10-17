import Link from "next/link";
import { PageHero } from "./PageHero";
import { EnquiryForm } from "./EnquiryForm";
import { StatusBadge } from "./StatusBadge";
import { productStatuses, type Product } from "@/content/products";
import { site } from "@/config/site";

/** Product summary card shared by the checkout and enquiry pages. */
export function ProductSummary({ product: p, children }: { product: Product; children?: React.ReactNode }) {
  return (
    <aside className="aside-card" aria-label="Order summary" style={{ position: "static" }}>
      <h2 style={{ fontSize: "1.15rem" }}>{p.name}</h2>
      <p>{p.shortDescription}</p>
      <dl>
        <div><dt>Status</dt><dd><StatusBadge status={p.status} /></dd></div>
        <div><dt>Price</dt><dd>{p.pricing?.display ?? "Contact us"}</dd></div>
        {p.pricing?.note && <div><dt>Note</dt><dd style={{ fontWeight: 500 }}>{p.pricing.note}</dd></div>}
        {p.licensing && <div><dt>Licence</dt><dd style={{ fontWeight: 500 }}>{p.licensing}</dd></div>}
        <div><dt>Sold by</dt><dd>{site.legalOwner}</dd></div>
      </dl>
      {children}
      <Link className="btn btn--secondary" style={{ marginTop: 12 }} href={`/products/${p.slug}`}>Back to product</Link>
    </aside>
  );
}

/** Purchase enquiry: used when a product has no online checkout, or is not yet available. */
export function ProductEnquiryPage({ product: p }: { product: Product }) {
  const available = p.status === "available";
  const title = available ? `Enquire to purchase ${p.name}` : `Ask about ${p.name}`;
  const intro = available
    ? "Tell us what you need and we will reply by email with licensing, pricing and how to buy."
    : `${p.name} is currently ${productStatuses[p.status].toLowerCase()}. Leave your details and we will follow up with you about availability.`;

  return (
    <>
      <PageHero
        title={title}
        intro={intro}
        crumbs={[
          { name: "Products", path: "/products" },
          { name: p.name, path: `/products/${p.slug}` },
          { name: available ? "Purchase enquiry" : "Availability", path: `/products/${p.slug}/purchase` },
        ]}
      />
      <section className="section">
        <div className="container two-col">
          <EnquiryForm kind="purchase" turnstileSiteKey={site.turnstileSiteKey} fixed={{ product: p.name, subject: `Purchase enquiry: ${p.name}` }} />
          <ProductSummary product={p}>
            <p className="hint">
              Before you buy, see our <Link href="/license-agreement">License Agreement</Link>,{" "}
              <Link href="/refund-policy">Refund Policy</Link> and <Link href="/terms-of-service">Terms of Service</Link>.
            </p>
          </ProductSummary>
        </div>
      </section>
    </>
  );
}
