import Link from "next/link";
import { Button } from "@/components/Button";
import { HeroVisual } from "@/components/HeroVisual";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { CtaBand } from "@/components/CtaBand";
import { getProducts, productCategories } from "@/content/products";
import { services, serviceProcess } from "@/content/services";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${site.brand} — ${site.tagline}`,
  description:
    "Bridgecodes creates practical, reliable software products and digital solutions that help businesses streamline operations, serve customers, and grow with confidence.",
  path: "/",
});

const principles = [
  { icon: "building", title: "Designed around real business needs", text: "We start from the problem your team or customers face, not from a technology preference." },
  { icon: "layers", title: "Maintainable, scalable architecture", text: "We favour clear structure and sensible technology choices so software can be extended and supported." },
  { icon: "book", title: "Clear product documentation", text: "We aim to document how our software is installed, configured and used." },
  { icon: "template", title: "Thoughtful user experience", text: "Interfaces are designed to be understandable and efficient for the people who use them every day." },
  { icon: "mail", title: "Transparent project communication", text: "We agree scope, milestones and responsibilities in writing and keep you informed as work progresses." },
  { icon: "lifebuoy", title: "Ongoing support options", text: "Support and maintenance arrangements can be agreed for the software we build and sell." },
];

export default function HomePage() {
  const products = getProducts();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">{site.tagline}</p>
            <h1 id="hero-title">Software Solutions Built for the Way Business Works.</h1>
            <p className="lead">
              Bridgecodes creates practical, reliable software products and digital solutions that help businesses
              streamline operations, serve customers, and grow with confidence.
            </p>
            <div className="btn-row">
              <Button href="/products" arrow>Explore Our Products</Button>
              <Button href="/contact" variant="outline-light">Work With Us</Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="section" aria-labelledby="identity-title">
        <div className="container split">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 id="identity-title">A software brand with a clear owner.</h2>
            <p>
              Bridgecodes is the software development and digital products brand of {site.legalOwner} We build and
              deliver technology solutions designed to solve practical problems for businesses and individuals.
            </p>
            <p>
              We develop, own, license and sell our own software, and we build custom software for clients.
            </p>
            <Link className="link-arrow" href="/about">About Bridgecodes <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="identity-panel">
            <dl>
              <div><dt>Brand</dt><dd>{site.brand}</dd></div>
              <div><dt>Owned and operated by</dt><dd>{site.legalOwner}</dd></div>
              <div><dt>What we do</dt><dd>Software products, digital solutions and custom development</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="products-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Product portfolio</p>
            <h2 id="products-title">Software products from Bridgecodes</h2>
            <p>Products we develop and own, with honest availability status on every listing.</p>
          </div>
          {products.length > 0 ? (
            <>
              <div className="grid grid--3">
                {products.slice(0, 3).map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
              <p style={{ marginTop: 28 }}>
                <Link className="link-arrow" href="/products">View all products <Icon name="arrow" size={16} /></Link>
              </p>
            </>
          ) : (
            <div className="empty">
              <h3>Our product catalogue is being prepared</h3>
              <p>
                We will list products here as they are ready, each with its status, documentation and official
                purchase options. In the meantime, we are focused on the following areas:
              </p>
              <ul className="category-chips" style={{ justifyContent: "center" }}>
                {productCategories.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <div className="btn-row btn-row--center" style={{ marginTop: 24 }}>
                <Button href="/products" variant="secondary">View catalogue</Button>
                <Button href="/contact">Ask about a product</Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Services</p>
            <h2 id="services-title">Custom software and technical services</h2>
            <p>Beyond our own products, we design and build software for organisations with specific needs.</p>
          </div>
          <div className="grid grid--4">
            {services.map((s) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="card">
                <span className="icon-tile"><Icon name={s.icon} /></span>
                <h3>{s.name}</h3>
                <p>{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="why-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Why Bridgecodes?</p>
            <h2 id="why-title">How we approach software</h2>
            <p>These are the principles we work by.</p>
          </div>
          <div className="grid grid--3">
            {principles.map((p) => (
              <div key={p.title} className="card">
                <span className="icon-tile"><Icon name={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">How we work</p>
            <h2 id="how-title">A simple, four-step process</h2>
          </div>
          <ol className="steps">
            {serviceProcess.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
