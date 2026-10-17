import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Bridgecodes is a software development and digital solutions brand owned by Numi Innovations Ltd. Learn about our mission, values and approach to quality and support.",
  path: "/about",
});

const values = [
  { icon: "shield", title: "Accountability", text: "We own what we build and stand behind it with documentation and support." },
  { icon: "layers", title: "Practicality", text: "We choose solutions that solve the actual problem, not the most fashionable technology." },
  { icon: "book", title: "Clarity", text: "We communicate plainly about scope, status, licensing and limitations." },
  { icon: "wrench", title: "Craftsmanship", text: "We care about maintainable code, sensible design and reliable behaviour." },
];

export default function AboutPage() {
  const { registeredAddress, registrationNumber } = site.company;
  const hasCompanyDetails = Boolean(registeredAddress || registrationNumber);
  return (
    <>
      <PageHero
        title="About Bridgecodes"
        intro="Bridgecodes is a software development and digital solutions brand owned by Numi Innovations Ltd. We focus on creating useful, dependable software products and delivering technology services that help businesses and individuals solve practical challenges."
        crumbs={[{ name: "About Us", path: "/about" }]}
      />

      <section className="section" aria-labelledby="overview-title">
        <div className="container split">
          <div>
            <h2 id="overview-title">Company overview</h2>
            <p>
              Bridgecodes develops, owns, licenses and sells software products and digital solutions, and provides
              software development services. Our work includes business applications, SaaS platforms, web and mobile
              applications, developer tools, templates and custom software.
            </p>
            <p>
              Our products are offered through this website and, where listings are published, through established
              third-party software marketplaces. We are responsible for what we build: its documentation, licensing
              and support.
            </p>
          </div>
          <div className="grid">
            <div className="card">
              <h3>Mission</h3>
              <p>To make useful, reliable technology accessible through thoughtfully designed software products and digital solutions.</p>
            </div>
            <div className="card">
              <h3>Vision</h3>
              <p>To build software products that help businesses and individuals work more effectively in an increasingly digital world.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="values-title">
        <div className="container">
          <div className="section__head"><h2 id="values-title">Values</h2></div>
          <div className="grid grid--4">
            {values.map((v) => (
              <div className="card" key={v.title}>
                <span className="icon-tile"><Icon name={v.icon} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="philosophy-title">
        <div className="container grid grid--2">
          <div>
            <h2 id="philosophy-title">Product development philosophy</h2>
            <p>
              We start with a concrete problem and a specific kind of user. We keep products focused, build them so
              they can be maintained and extended, and describe them accurately: including what is not finished yet.
              Products that are not ready are labelled “In Development” or “Coming Soon”.
            </p>
          </div>
          <div>
            <h2>Quality and support</h2>
            <p>
              We test our work, document how it is installed and used, and provide support channels for customers.
              Release notes and update information will be published with each product. Visit the{" "}
              <Link href="/support">Support Center</Link> or read our <Link href="/faq">FAQ</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--dark" id="legal-identity" aria-labelledby="legal-title">
        <div className="container split">
          <div>
            <h2 id="legal-title">Legal ownership and business identity</h2>
            <p>
              {site.ownershipStatement} Numi Innovations Ltd. is the legal entity that owns the Bridgecodes brand,
              its software, and this website, and is the contracting party for products and services sold under the
              Bridgecodes name.
            </p>
            <p>
              Our <Link href="/privacy-policy" style={{ color: "#9bb8ff" }}>Privacy Policy</Link>,{" "}
              <Link href="/terms-of-service" style={{ color: "#9bb8ff" }}>Terms of Service</Link>,{" "}
              <Link href="/refund-policy" style={{ color: "#9bb8ff" }}>Refund Policy</Link> and{" "}
              <Link href="/license-agreement" style={{ color: "#9bb8ff" }}>License Agreement</Link> apply.
            </p>
          </div>
          <div className="identity-panel" style={{ background: "var(--navy)", border: "1px solid #344054" }}>
            <dl>
              <div><dt>Brand</dt><dd>{site.brand}</dd></div>
              <div><dt>Legal owner</dt><dd>{site.legalOwner}</dd></div>
              {site.urlConfigured && <div><dt>Official website</dt><dd>{site.url.replace(/^https?:\/\//, "")}</dd></div>}
              {site.contact.email && <div><dt>Business email</dt><dd>{site.contact.email}</dd></div>}
              {site.contact.supportEmail && <div><dt>Customer support</dt><dd>{site.contact.supportEmail}</dd></div>}
              {registrationNumber && <div><dt>Company registration</dt><dd>{registrationNumber}</dd></div>}
              {registeredAddress && <div><dt>Registered address</dt><dd>{registeredAddress}</dd></div>}
            </dl>
            {!hasCompanyDetails && (
              <p style={{ marginTop: 20, marginBottom: 0, fontSize: "0.9rem" }}>
                Further company registration details will be published here when confirmed. For questions, use the{" "}
                <Link href="/contact" style={{ color: "#9bb8ff" }}>contact page</Link>.
              </p>
            )}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
