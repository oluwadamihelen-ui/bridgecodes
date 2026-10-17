/**
 * Product catalogue — the single place to add or edit products.
 *
 * HOW TO ADD A PRODUCT
 *   1. Copy an entry in `products` below and set `published: true`.
 *   2. Fill only what is true. Optional fields that are omitted are simply
 *      not shown (no placeholders, no invented data).
 *   3. Put screenshots in /public/products/<slug>/ and reference them below.
 *   4. Add `purchaseLinks` ONLY once the listing is live (website checkout or
 *      a real marketplace listing URL).
 *
 * The site ships with NO published products on purpose: no product has been
 * confirmed yet, and the site must not invent products, prices or listings.
 * The entry below is an unpublished template used to preview the layouts
 * (set PREVIEW_UNPUBLISHED_PRODUCTS=true to see it locally).
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

const allProducts: Product[] = [
  {
    slug: "example-product",
    name: "Example Product",
    published: false,
    category: "Business Management Software",
    status: "in-development",
    shortDescription:
      "Template entry used to preview the catalogue layout. Replace with a real product before publishing.",
    overview:
      "This is an unpublished template entry. Replace this text with a factual overview of the product: what it does, who it is for, and what problem it solves.",
    audience: ["Small and medium-sized businesses", "Operations teams"],
    capabilities: ["Capability one", "Capability two", "Capability three"],
    features: [
      { title: "Feature title", description: "A factual description of the feature." },
      { title: "Another feature", description: "A factual description of the feature." },
    ],
    requirements: ["Modern web browser"],
    platforms: ["Web"],
    deployment: ["Hosted by Bridgecodes", "Self-hosted"],
    licensing: "Describe the licence model that actually applies to this product.",
    updatePolicy: "Describe the update and maintenance policy once it is decided.",
  },
];

const showUnpublished = process.env.PREVIEW_UNPUBLISHED_PRODUCTS === "true";

export const getProducts = (): Product[] =>
  allProducts.filter((p) => p.published || (showUnpublished && process.env.NODE_ENV !== "production"));

export const getProduct = (slug: string) => getProducts().find((p) => p.slug === slug);
