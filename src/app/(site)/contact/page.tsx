import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactDetails } from "@/components/ContactDetails";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Bridgecodes about products, licensing, partnerships or custom software development. Send an enquiry and our team will reply by email.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Bridgecodes"
        intro="Tell us what you are building, or ask about our products, licensing or partnerships."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />
      <section className="section">
        <div className="container two-col">
          <EnquiryForm kind="contact" turnstileSiteKey={site.turnstileSiteKey} />
          <div>
            <h2 style={{ fontSize: "1.3rem" }}>Company details</h2>
            <ContactDetails />
            <div className="note" style={{ marginTop: 28 }}>
              <p>
                Need help with a product you already use? Please use the <Link href="/support">Support Center</Link> so
                your request is routed correctly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
