import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { serviceFaqs, serviceProcess, services } from "@/content/services";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Custom software, web and mobile application development, SaaS, automation, e-commerce, API integration and ongoing technical support from Bridgecodes.",
  path: "/services",
});

export default function ServicesPage() {
  const jsonLd = services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.summary,
    provider: { "@type": "Organization", name: site.brand },
  }));
  return (
    <>
      <PageHero
        title="Software Development Services"
        intro="We design and build custom software for organisations that need something fitted to the way they work."
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <ul className="category-chips">
          {services.map((s) => <li key={s.slug}><Link href={`#${s.slug}`}>{s.name}</Link></li>)}
        </ul>
      </PageHero>

      <section className="section" aria-labelledby="scope-title">
        <div className="container">
          <h2 id="scope-title" className="sr-only">What we offer</h2>
          {services.map((s) => (
            <article key={s.slug} id={s.slug} className="service">
              <div>
                <span className="icon-tile"><Icon name={s.icon} /></span>
                <h3 style={{ fontSize: "1.35rem" }}>{s.name}</h3>
                <p className="muted">{s.summary}</p>
              </div>
              <div className="service__cols">
                <div>
                  <h3>Scope of service</h3>
                  <ul className="plain-list">{s.scope.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <h3>Typical deliverables</h3>
                  <ul className="plain-list">{s.deliverables.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="process-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Development process</p>
            <h2 id="process-title">How projects run</h2>
          </div>
          <ol className="steps">
            {serviceProcess.map((s) => <li key={s.title}><h3>{s.title}</h3><p>{s.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="start-title">
        <div className="container split">
          <div>
            <h2 id="start-title">How projects are initiated</h2>
            <p>
              Send us a project enquiry describing the problem you want to solve, who will use the software, any
              existing systems it must work with, and your timeline. We will review it and reply to arrange a
              conversation. After that we provide a written proposal. We do not publish fixed service prices, because
              the right price depends on scope.
            </p>
            <Button href="/contact">Start a project enquiry</Button>
          </div>
          <div>
            <h2>Maintenance and support</h2>
            <p>
              Software needs care after launch. We can agree maintenance and technical support for software we build
              or maintain, covering fixes, dependency updates, minor enhancements and assistance for your team. The
              scope, and any response commitments, are defined in your agreement. Existing customers can also use the{" "}
              <Link href="/support">Support Center</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container">
          <h2 id="faq-title">Frequently asked questions</h2>
          <FaqList items={serviceFaqs} />
        </div>
      </section>

      <CtaBand title="Ready to discuss your project?" text="Tell us about the problem and we will explore the right approach with you." />
      {jsonLd.map((d, i) => <JsonLd key={i} data={d} />)}
    </>
  );
}
