import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactDetails } from "@/components/ContactDetails";
import { FaqList } from "@/components/FaqList";
import { Icon } from "@/components/Icon";
import { faqs } from "@/content/faqs";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Support Center",
  description:
    "Get help with Bridgecodes products: technical support, installation and configuration assistance, bug reports, documentation and FAQs.",
  path: "/support",
});

const supportFaqs = faqs.filter((f) =>
  ["Do you provide installation assistance?", "How do I report a bug?", "How can I request a refund?", "How do software licenses work?"].includes(f.q),
);

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Support Center"
        intro="Help for customers and marketplace buyers of Bridgecodes products."
        crumbs={[{ name: "Support Center", path: "/support" }]}
      />

      <section className="section" aria-labelledby="overview-title">
        <div className="container">
          <div className="section__head">
            <h2 id="overview-title">How we can help</h2>
            <p>
              Choose the option that fits your situation. All requests are received by the same team and categorised by type.
            </p>
          </div>
          <div className="grid grid--4">
            <a className="card" href="#support-request"><span className="icon-tile"><Icon name="lifebuoy" /></span><h3>Technical support</h3><p>Questions about using a product.</p></a>
            <a className="card" href="#support-request"><span className="icon-tile"><Icon name="wrench" /></span><h3>Installation &amp; configuration</h3><p>Help getting a product set up.</p></a>
            <a className="card" href="#bug-report"><span className="icon-tile"><Icon name="bug" /></span><h3>Report a bug</h3><p>Tell us about a defect.</p></a>
            <Link className="card" href="/resources"><span className="icon-tile"><Icon name="book" /></span><h3>Documentation</h3><p>Guides and release notes.</p></Link>
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="info-title">
        <div className="container two-col">
          <div>
            <h2 id="info-title">Before you contact us</h2>
            <p>The more detail you give us, the faster we can help. Please include:</p>
            <ul className="plain-list">
              <li><strong>Product name</strong> and where you obtained it (this website or a marketplace)</li>
              <li><strong>Product version</strong>, if you can find it</li>
              <li><strong>Your environment</strong>: operating system, browser, hosting or database</li>
              <li><strong>What you expected</strong> and <strong>what happened</strong> instead</li>
              <li><strong>Exact error messages</strong> or screenshots</li>
              <li>Your <strong>order reference</strong> for licence or billing questions (never send passwords or payment card numbers)</li>
            </ul>
            <p style={{ marginTop: 16 }}>
              <strong>Response expectations:</strong> we read every request and reply by email. Support response times
              have not yet been established, so we do not state a guaranteed response time here. Any response commitment
              for a particular product or agreement will be stated on that product page or in your agreement.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem" }}>Support contact</h2>
            <ContactDetails variant="support" />
          </div>
        </div>
      </section>

      <section className="section" id="support-request" aria-labelledby="req-title">
        <div className="container two-col">
          <div>
            <h2 id="req-title">Technical support and installation help</h2>
            <p>Ask a question about a product, or request help with installation and configuration.</p>
          </div>
          <EnquiryForm kind="support" turnstileSiteKey={site.turnstileSiteKey} />
        </div>
      </section>

      <section className="section section--alt" id="bug-report" aria-labelledby="bug-title">
        <div className="container two-col">
          <div>
            <h2 id="bug-title">Report a bug</h2>
            <p>
              Found something that does not work as it should? Describe how to reproduce it and we will investigate.
              Please check the <Link href="/resources">release notes</Link> first in case it has already been fixed.
            </p>
          </div>
          <EnquiryForm kind="bug" turnstileSiteKey={site.turnstileSiteKey} />
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <h2 id="faq-title">Support FAQs</h2>
          <FaqList items={supportFaqs} />
          <p style={{ marginTop: 20 }}><Link href="/faq">See all frequently asked questions</Link></p>
        </div>
      </section>
    </>
  );
}
