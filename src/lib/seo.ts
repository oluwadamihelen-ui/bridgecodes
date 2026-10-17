import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";

type PageMeta = { title: string; description: string; path: string; noindex?: boolean };

/** Per-page metadata: unique title, description, canonical, Open Graph and Twitter. */
export function pageMetadata({ title, description, path, noindex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.brand, type: "website", locale: "en" },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.brand,
  url: site.url,
  logo: absoluteUrl("/icon"),
  description: site.description,
  parentOrganization: { "@type": "Organization", name: site.legalOwner },
  ...(site.contact.email ? { email: site.contact.email } : {}),
  ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.brand,
  url: site.url,
  publisher: { "@type": "Organization", name: site.brand },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});
