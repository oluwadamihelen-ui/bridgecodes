/**
 * Resource hub content. ONLY add an entry when the document actually exists.
 * Product documentation links belong on the product itself (products.ts) and
 * are surfaced automatically here.
 */
export const resourceCategories = [
  { id: "documentation", title: "Product documentation", description: "Reference documentation for each product." },
  { id: "installation", title: "Installation guides", description: "Step-by-step setup and configuration instructions." },
  { id: "manuals", title: "User manuals", description: "Guides for everyday use of our products." },
  { id: "tutorials", title: "Tutorials", description: "Walk-throughs for common tasks." },
  { id: "release-notes", title: "Release notes", description: "What changed in each product release." },
  { id: "updates", title: "Software update information", description: "How to update products and what to expect." },
  { id: "developer", title: "Developer resources", description: "API references and technical guides." },
] as const;

export type ResourceCategoryId = (typeof resourceCategories)[number]["id"];

export const resourceCategoryIds = resourceCategories.map((c) => c.id) as readonly string[];

/**
 * Picks a resource category from a document title when none was chosen explicitly in the admin.
 * e.g. "Production deployment" -> installation, "Administration and user guide" -> manuals.
 */
export function guessResourceCategory(title: string): ResourceCategoryId {
  const t = title.toLowerCase();
  if (/release|changelog|what.?s new|version history/.test(t)) return "release-notes";
  if (/\bapi\b|developer|sdk|webhook|integration/.test(t)) return "developer";
  if (/upgrade|migration|update/.test(t)) return "updates";
  if (/tutorial|walk-?through|how to|getting started|quick ?start/.test(t)) return "tutorials";
  if (/install|deploy|setup|set up|configur|vercel|hosting|testing/.test(t)) return "installation";
  if (/user guide|user manual|manual|admin|handbook|usage/.test(t)) return "manuals";
  return "documentation";
}

export type ResourceItem = {
  category: ResourceCategoryId;
  title: string;
  description: string;
  href: string;
};

export const resourceItems: ResourceItem[] = [];
