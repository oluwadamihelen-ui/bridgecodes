import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { guessResourceCategory, resourceCategories, resourceItems } from "@/content/resources";
import { getProducts } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Documentation and Resources",
  description:
    "Product documentation, installation guides, user manuals, tutorials, release notes and developer resources from Bridgecodes.",
  path: "/resources",
});

export default async function ResourcesPage() {
  // Documentation published on products is surfaced automatically.
  const productDocs = (await getProducts()).flatMap((p) =>
    (p.documentation ?? []).map((d) => ({ title: `${p.name}: ${d.label}`, description: `${d.label} for ${p.name}.`, href: d.href, category: d.category ?? guessResourceCategory(d.label) })),
  );
  const items = [...resourceItems, ...productDocs];
  const anyPublished = items.length > 0;

  return (
    <>
      <PageHero
        title="Documentation and Resources"
        intro="Guides, manuals and update information for Bridgecodes products. We only list documentation that exists."
        crumbs={[{ name: "Resources", path: "/resources" }]}
      />
      <section className="section">
        <div className="container">
          {!anyPublished && (
            <div className="note note--warn" style={{ marginBottom: 32 }}>
              <p>
                No documentation has been published yet. Documentation will appear here as each product is released.
                Need something specific? <Link href="/support">Contact support</Link>.
              </p>
            </div>
          )}
          <div className="grid grid--2">
            {resourceCategories.map((c) => {
              const list = items.filter((i) => i.category === c.id);
              return (
                <section key={c.id} className="card" id={c.id} aria-labelledby={`${c.id}-t`}>
                  <h2 id={`${c.id}-t`} style={{ fontSize: "1.2rem" }}>{c.title}</h2>
                  <p>{c.description}</p>
                  {list.length > 0 ? (
                    <ul className="plain-list">
                      {list.map((i) => <li key={i.href}><a href={i.href} {...(/^https?:/.test(i.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{i.title}</a></li>)}
                    </ul>
                  ) : (
                    <p><span className="badge badge--coming-soon">Forthcoming</span></p>
                  )}
                </section>
              );
            })}
            <section className="card" id="faq" aria-labelledby="faq-t">
              <h2 id="faq-t" style={{ fontSize: "1.2rem" }}>Frequently asked questions</h2>
              <p>Answers to common questions about Bridgecodes, licensing and support.</p>
              <Link className="btn btn--secondary btn--sm" href="/faq">Read the FAQ</Link>
            </section>
          </div>
        </div>
      </section>
      <CtaBand title="Can't find what you need?" text="Ask our support team, or tell us what documentation would help." />
    </>
  );
}
