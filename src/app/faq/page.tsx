import { PageHero } from "@/components/PageHero";
import { FaqList } from "@/components/FaqList";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about Bridgecodes: who owns it, what we build, where to buy, licensing, installation help, bug reports, refunds and support.",
  path: "/faq",
});

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        intro="Quick answers about Bridgecodes, our products and how we work."
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />
      <section className="section">
        <div className="container"><FaqList items={faqs} /></div>
      </section>
      <CtaBand title="Still have a question?" text="Contact our team and we will be happy to help." />
      <JsonLd data={jsonLd} />
    </>
  );
}
