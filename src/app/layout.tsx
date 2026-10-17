import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ConsentAndAnalytics } from "@/components/ConsentAndAnalytics";
import { absoluteUrl, mainNav, site } from "@/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — ${site.tagline}`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.legalOwner }],
  creator: site.legalOwner,
  publisher: site.legalOwner,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.brand,
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
    url: absoluteUrl("/"),
  },
  twitter: { card: "summary_large_image" },
  // Never ask search engines to index a build that has no confirmed domain.
  robots: site.urlConfigured ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <Header nav={mainNav} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <ConsentAndAnalytics />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
