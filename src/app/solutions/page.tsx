import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { solutions } from "@/content/solutions";
import { services } from "@/content/services";
import { getProducts } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Solutions",
  description:
    "Software solutions organised by customer need: business operations, education, commerce, workflow automation, customer portals and digital product infrastructure.",
  path: "/solutions",
});

export default function SolutionsPage() {
  const products = getProducts();
  return (
    <>
      <PageHero
        title="Solutions by Customer Need"
        intro="We organise what we build around the problems organisations face, not around technology alone."
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
      />
      <section className="section">
        <div className="container grid grid--2">
          {solutions.map((s) => {
            const related = products.filter((p) => s.productCategories.includes(p.category));
            return (
              <article key={s.slug} id={s.slug} className="card">
                <span className="icon-tile"><Icon name={s.icon} /></span>
                <h2 style={{ fontSize: "1.4rem" }}>{s.name}</h2>
                <p>{s.summary}</p>
                <h3 style={{ fontSize: "1rem" }}>Problems this addresses</h3>
                <ul className="tick-list">
                  {s.problems.map((p) => <li key={p}><Icon name="check" size={16} />{p}</li>)}
                </ul>
                <h3 style={{ fontSize: "1rem" }}>Relevant services</h3>
                <ul className="plain-list">
                  {s.services.map((slug) => {
                    const svc = services.find((x) => x.slug === slug);
                    return svc ? <li key={slug}><Link href={`/services#${slug}`}>{svc.name}</Link></li> : null;
                  })}
                </ul>
                <h3 style={{ fontSize: "1rem", marginTop: 16 }}>Relevant products</h3>
                {related.length > 0 ? (
                  <ul className="plain-list">
                    {related.map((p) => <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>)}
                  </ul>
                ) : (
                  <p>No products are published yet in this area. <Link href="/contact">Tell us what you need</Link>.</p>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
