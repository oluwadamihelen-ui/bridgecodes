import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsentAndAnalytics } from "@/components/ConsentAndAnalytics";
import { mainNav } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Public-site frame: skip link, header, main landmark, footer, analytics and site-wide structured data. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header nav={mainNav} />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      <ConsentAndAnalytics />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
    </>
  );
}
