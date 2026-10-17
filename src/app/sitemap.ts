import type { MetadataRoute } from "next";
import { absoluteUrl, footerNav, mainNav } from "@/config/site";
import { getProducts } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>(["/", "/support", "/faq"]);
  mainNav.forEach((n) => paths.add(n.href));
  Object.values(footerNav).flat().forEach((n) => paths.add(n.href));
  getProducts().forEach((p) => paths.add(`/products/${p.slug}`));

  return [...paths].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/products" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/products" || path === "/about" ? 0.8 : 0.6,
  }));
}
