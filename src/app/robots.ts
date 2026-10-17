import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Without a confirmed production domain, ask crawlers to stay away.
  if (!site.urlConfigured) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
