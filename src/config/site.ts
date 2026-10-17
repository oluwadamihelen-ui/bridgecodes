/**
 * Central company configuration.
 *
 * Everything that identifies the business (domain, contact channels, social
 * profiles, legal settings) lives here and is driven by environment variables,
 * so nothing is invented or hard-coded across components. Any value that is
 * not configured is `null` and simply not displayed.
 *
 * Values are read on the server at build/request time. See `.env.example`.
 */

const clean = (value: string | undefined): string | null => {
  const v = value?.trim();
  return v ? v : null;
};

const siteUrlRaw = clean(process.env.SITE_URL)?.replace(/\/+$/, "") ?? null;

export const site = {
  brand: "Bridgecodes",
  legalOwner: "Numi Innovations Ltd.",
  tagline: "Technology Built for Real Business.",
  description:
    "Bridgecodes designs, develops, and delivers software products and digital solutions that help businesses operate smarter, automate workflows, and unlock new opportunities.",
  ownershipStatement:
    "Bridgecodes is a software development and digital products brand owned by Numi Innovations Ltd.",
  ownershipShort: "Bridgecodes is owned by Numi Innovations Ltd.",

  /** True only when an official production domain has been supplied. */
  urlConfigured: siteUrlRaw !== null,
  url: siteUrlRaw ?? "http://localhost:3000",

  contact: {
    email: clean(process.env.CONTACT_EMAIL),
    supportEmail: clean(process.env.SUPPORT_EMAIL),
    phone: clean(process.env.CONTACT_PHONE),
  },

  company: {
    registeredAddress: clean(process.env.REGISTERED_ADDRESS),
    registrationNumber: clean(process.env.COMPANY_REGISTRATION_NUMBER),
  },

  /** Only profiles with a configured URL are rendered. */
  social: (
    [
      ["LinkedIn", process.env.SOCIAL_LINKEDIN],
      ["X", process.env.SOCIAL_X],
      ["GitHub", process.env.SOCIAL_GITHUB],
      ["YouTube", process.env.SOCIAL_YOUTUBE],
      ["Facebook", process.env.SOCIAL_FACEBOOK],
      ["Instagram", process.env.SOCIAL_INSTAGRAM],
    ] as const
  )
    .map(([name, href]) => ({ name, href: clean(href) }))
    .filter((s): s is { name: (typeof s)["name"]; href: string } => s.href !== null),

  legal: {
    effectiveDate: clean(process.env.LEGAL_EFFECTIVE_DATE),
    governingJurisdiction: clean(process.env.LEGAL_GOVERNING_JURISDICTION),
    privacyContactEmail:
      clean(process.env.LEGAL_PRIVACY_CONTACT_EMAIL) ?? clean(process.env.CONTACT_EMAIL),
    refundWindowDays: clean(process.env.LEGAL_REFUND_WINDOW_DAYS),
    /** Flip to true only once a lawyer has reviewed every legal page. */
    reviewed: process.env.LEGAL_REVIEWED === "true",
  },

  analytics: {
    plausibleDomain: clean(process.env.PLAUSIBLE_DOMAIN),
    plausibleSrc: clean(process.env.PLAUSIBLE_SCRIPT_SRC) ?? "https://plausible.io/js/script.js",
    requiresConsent: process.env.ANALYTICS_REQUIRES_CONSENT === "true",
  },

  turnstileSiteKey: clean(process.env.TURNSTILE_SITE_KEY),
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Primary navigation (single source for header, footer and sitemap). */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  explore: [
    { label: "Products", href: "/products" },
    { label: "Solutions", href: "/solutions" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
  ],
  help: [
    { label: "Contact", href: "/contact" },
    { label: "Support Center", href: "/support" },
    { label: "Documentation", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "License Agreement", href: "/license-agreement" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;
