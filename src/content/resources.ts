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

export type ResourceItem = {
  category: (typeof resourceCategories)[number]["id"];
  title: string;
  description: string;
  href: string;
};

export const resourceItems: ResourceItem[] = [];
