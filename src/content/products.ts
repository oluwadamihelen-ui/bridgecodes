/**
 * Product catalogue — the single place to add or edit products.
 *
 * PREFERRED: add and edit products from the admin area at /admin (see README).
 * Products saved there take over from the list below.
 *
 * HOW TO ADD A PRODUCT IN CODE
 *   1. Copy an entry in `codeProducts` below and set `published: true`.
 *   2. Fill only what is true. Optional fields that are omitted are simply
 *      not shown (no placeholders, no invented data).
 *   3. Put screenshots in /public/products/<slug>/ and reference them below.
 *   4. Add `purchaseLinks` ONLY once the listing is live (website checkout or
 *      a real marketplace listing URL).
 *
 * The site ships with NO products on purpose: none have been confirmed yet, and the
 * site must not invent products, prices or listings.
 */

export const productCategories = [
  "Business Management Software",
  "Education Technology",
  "SaaS Applications",
  "E-commerce Solutions",
  "Developer Tools",
  "Website and Application Templates",
  "Custom Software",
] as const;
export type ProductCategory = (typeof productCategories)[number];

export const productStatuses = {
  available: "Available",
  beta: "Beta",
  "in-development": "In Development",
  "coming-soon": "Coming Soon",
} as const;
export type ProductStatus = keyof typeof productStatuses;

export type ProductLink = { label: string; href: string };

export type Product = {
  slug: string;
  name: string;
  /** Hide from the public site until true. */
  published: boolean;
  category: ProductCategory;
  status: ProductStatus;
  shortDescription: string;
  overview: string;
  audience: string[];
  capabilities: string[];
  features?: { title: string; description: string }[];
  screenshots?: { src: string; alt: string; width: number; height: number }[];
  logo?: { src: string; alt: string };
  requirements?: string[];
  platforms?: string[];
  deployment?: string[];
  /** Only set when pricing is confirmed. `display` is shown verbatim. */
  pricing?: { display: string; note?: string };
  licensing?: string;
  installation?: string[];
  documentation?: ProductLink[];
  updatePolicy?: string;
  supportNote?: string;
  /** Real, live links only (own checkout or a published marketplace listing). */
  purchaseLinks?: (ProductLink & { channel: string })[];
  trialLink?: ProductLink;
  version?: string;
};

/** Built-in list. Used until products are saved from the admin area (/admin). */
export const codeProducts: Product[] = [
  // Example (copy, uncomment and fill in with real details):
  // {
  //   slug: "my-product",
  //   name: "My Product",
  //   published: true,
  //   category: "SaaS Applications",
  //   status: "in-development",
  //   shortDescription: "One or two factual sentences.",
  //   overview: "What it does and who it is for.",
  //   audience: ["Small businesses"],
  //   capabilities: ["Capability one", "Capability two"],
  // },
];
