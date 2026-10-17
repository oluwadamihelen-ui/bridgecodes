export type Solution = {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  problems: string[];
  /** Slugs from services.ts */
  services: string[];
  /** Product categories from products.ts */
  productCategories: string[];
};

export const solutions: Solution[] = [
  {
    slug: "business-operations",
    name: "Business Operations",
    icon: "building",
    summary: "Software that gives teams one clear place to manage daily operations.",
    problems: [
      "Information scattered across spreadsheets and disconnected tools",
      "Limited visibility into the status of work and resources",
      "Manual reporting that takes time away from real work",
    ],
    services: ["custom-software-development", "web-application-development"],
    productCategories: ["Business Management Software"],
  },
  {
    slug: "education-and-administration",
    name: "Education and Administration",
    icon: "graduation",
    summary: "Tools that help institutions manage records, communication and administration.",
    problems: [
      "Paper-based or fragmented record keeping",
      "Time-consuming administrative processes",
      "Difficulty sharing information with staff, learners or guardians",
    ],
    services: ["web-application-development", "business-process-automation"],
    productCategories: ["Education Technology"],
  },
  {
    slug: "commerce-and-retail",
    name: "Commerce and Retail",
    icon: "cart",
    summary: "Selling online and managing orders, catalogues and customers.",
    problems: [
      "Manual order and inventory handling",
      "Storefronts that are hard to adapt to the way you sell",
      "Disconnected payment, delivery and accounting systems",
    ],
    services: ["e-commerce-development", "api-development-and-integration"],
    productCategories: ["E-commerce Solutions", "Website and Application Templates"],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    icon: "workflow",
    summary: "Replace repetitive manual steps with dependable automated workflows.",
    problems: [
      "Approvals and hand-offs that depend on email chains",
      "Data re-entered between systems",
      "Processes that are hard to audit or repeat consistently",
    ],
    services: ["business-process-automation", "api-development-and-integration"],
    productCategories: ["Business Management Software", "SaaS Applications"],
  },
  {
    slug: "customer-portals",
    name: "Customer Portals",
    icon: "users",
    summary: "Secure self-service spaces for customers, partners or members.",
    problems: [
      "Customers contacting you for information they could access themselves",
      "No central place to share documents, status or invoices",
      "Account access that is hard to manage securely",
    ],
    services: ["web-application-development", "saas-product-development"],
    productCategories: ["SaaS Applications"],
  },
  {
    slug: "digital-product-infrastructure",
    name: "Digital Product Infrastructure",
    icon: "terminal",
    summary: "The APIs, tooling and foundations that digital products are built on.",
    problems: [
      "Products that are difficult to extend or integrate",
      "Missing documentation and developer tooling",
      "Infrastructure that has not been designed to scale or be maintained",
    ],
    services: ["api-development-and-integration", "saas-product-development", "software-maintenance-and-support"],
    productCategories: ["Developer Tools"],
  },
];
