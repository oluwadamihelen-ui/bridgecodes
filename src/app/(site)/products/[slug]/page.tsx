import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StatusBadge } from "@/components/StatusBadge";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/Button";
import { getProduct, getProducts } from "@/lib/catalogue";
import { absoluteUrl, site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { isInternalHref } from "@/lib/links";

type Params = { slug: string };

// New products saved in the admin render on first visit; unknown slugs return 404.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: p.name,
    description: p.shortDescription,
    path: `/products/${p.slug}`,
  });
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="plain-list">{items.map((i) => <li key={i}>{i}</li>)}</ul>
);

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const supportEmail = site.contact.supportEmail ?? site.contact.email;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.shortDescription,
    applicationCategory: p.category,
    url: absoluteUrl(`/products/${p.slug}`),
    ...(p.version ? { softwareVersion: p.version } : {}),
    ...(p.platforms ? { operatingSystem: p.platforms.join(", ") } : {}),
    publisher: { "@type": "Organization", name: site.brand },
    creator: { "@type": "Organization", name: site.brand },
  };

  return (
    <>
      <PageHero
        title={p.name}
        intro={p.shortDescription}
        crumbs={[{ name: "Products", path: "/products" }, { name: p.name, path: `/products/${p.slug}` }]}
      >
        <p style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <StatusBadge status={p.status} /> <span className="muted">{p.category}</span>
        </p>
      </PageHero>

      <div className="section">
        <div className="container detail">
          <div>
            <Block title="Overview"><p>{p.overview}</p></Block>
            <Block title="Intended users"><List items={p.audience} /></Block>
            <Block title="Key capabilities"><List items={p.capabilities} /></Block>

            {p.features && p.features.length > 0 && (
              <Block title="Features">
                <div className="grid grid--2">
                  {p.features.map((f) => (
                    <div className="card" key={f.title}><h3>{f.title}</h3><p>{f.description}</p></div>
                  ))}
                </div>
              </Block>
            )}

            <Block title="Screenshots">
              {p.screenshots && p.screenshots.length > 0 ? (
                <div className="shots">
                  {p.screenshots.map((s) => (
                    <Image key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 960px) 100vw, 400px" />
                  ))}
                </div>
              ) : (
                <p className="note">Screenshots will be added when the product interface is ready to show.</p>
              )}
            </Block>

            {(p.requirements || p.platforms || p.deployment) && (
              <Block title="Technical details">
                {p.requirements && <><h3>Technical requirements</h3><List items={p.requirements} /></>}
                {p.platforms && <><h3 style={{ marginTop: 16 }}>Supported platforms</h3><List items={p.platforms} /></>}
                {p.deployment && <><h3 style={{ marginTop: 16 }}>Deployment options</h3><List items={p.deployment} /></>}
              </Block>
            )}

            <Block title="Pricing and licensing">
              <p>
                {p.pricing ? <><strong>{p.pricing.display}</strong>{p.pricing.note ? ` — ${p.pricing.note}` : ""}</> : "Pricing has not been published yet. Contact us for details."}
              </p>
              <p>
                {p.licensing ? p.licensing + " " : ""}
                See the <Link href="/license-agreement">License Agreement</Link> and <Link href="/refund-policy">Refund Policy</Link>.
              </p>
            </Block>

            <Block title="Installation and documentation">
              {p.installation && p.installation.length > 0 && (
                <ol className="plain-list" style={{ listStyle: "decimal" }}>{p.installation.map((i) => <li key={i}>{i}</li>)}</ol>
              )}
              {p.documentation && p.documentation.length > 0 ? (
                <ul className="plain-list">
                  {p.documentation.map((d) => <li key={d.href}><a href={d.href}>{d.label}</a></li>)}
                </ul>
              ) : (
                <p className="note">Documentation for this product has not been published yet. Check the <Link href="/resources">Resources</Link> page for updates.</p>
              )}
            </Block>

            <Block title="Updates and maintenance">
              <p>{p.updatePolicy ?? "The update and maintenance policy for this product has not been published yet."}</p>
            </Block>

            <Block title="Support">
              <p>
                {p.supportNote ? p.supportNote + " " : ""}
                Get help through the <Link href="/support">Support Center</Link>
                {supportEmail ? <> or email <a href={`mailto:${supportEmail}`}>{supportEmail}</a></> : null}. When you write, include the product name, version and any error details.
              </p>
            </Block>
          </div>

          <aside className="aside-card" aria-label="Product summary">
            <dl>
              <div><dt>Status</dt><dd><StatusBadge status={p.status} /></dd></div>
              <div><dt>Category</dt><dd>{p.category}</dd></div>
              {p.version && <div><dt>Version</dt><dd>{p.version}</dd></div>}
              <div><dt>Price</dt><dd>{p.pricing?.display ?? "Contact us"}</dd></div>
              <div><dt>Owner</dt><dd>{site.legalOwner}</dd></div>
            </dl>
            {p.purchaseLinks?.map((l) => (
              <Button key={l.href} href={l.href} external={!isInternalHref(l.href)}>{l.label} <span className="sr-only">({l.channel})</span></Button>
            ))}
            {p.trialLink && <Button href={p.trialLink.href} variant="secondary" external={!isInternalHref(p.trialLink.href)}>{p.trialLink.label}</Button>}
            {!p.purchaseLinks?.length && (
              <Button href={`/products/${p.slug}/purchase`}>
                {p.status === "available" ? "Enquire about this product" : "Ask about availability"}
              </Button>
            )}
            <Button href="/support" variant="secondary">Get support</Button>
          </aside>
        </div>
      </div>
      <JsonLd data={jsonLd} />
    </>
  );
}
