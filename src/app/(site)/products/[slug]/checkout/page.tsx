import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CheckoutPanel } from "@/components/CheckoutPanel";
import { ProductEnquiryPage, ProductSummary } from "@/components/ProductEnquiryPage";
import { getProduct, getProducts } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

// Products saved in the admin render on first visit; unknown slugs return 404.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: `Checkout: ${p.name}`, description: `Buy ${p.name} from Bridgecodes.`, path: `/products/${p.slug}/checkout`, noindex: true });
}

export default async function CheckoutPage({ params }: { params: Promise<Params> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  // Not sellable online (yet): fall back to the purchase enquiry so nobody hits a dead end.
  if (!p.paymentLink || p.status !== "available") return <ProductEnquiryPage product={p} />;

  return (
    <>
      <PageHero
        title={`Checkout: ${p.name}`}
        intro="Review your order, then continue to our secure payment page."
        crumbs={[{ name: "Products", path: "/products" }, { name: p.name, path: `/products/${p.slug}` }, { name: "Checkout", path: `/products/${p.slug}/checkout` }]}
      />
      <section className="section">
        <div className="container two-col">
          <CheckoutPanel href={p.paymentLink.href} provider={p.paymentLink.provider} />
          <ProductSummary product={p}>
            <p className="hint">Prefer to talk first? <Link href={`/products/${p.slug}/purchase`}>Send a purchase enquiry</Link>.</p>
          </ProductSummary>
        </div>
      </section>
    </>
  );
}
