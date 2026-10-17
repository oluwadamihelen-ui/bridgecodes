/**
 * Legal page content — EDITABLE TEMPLATES, NOT LEGAL ADVICE.
 *
 * - Company-specific values come from `site.legal` / `site.contact` (env vars).
 * - Anything unresolved renders as a highlighted `[[TO CONFIRM: …]]` marker.
 * - Text may use [label](/path) links and [[markers]].
 * - Every page shows a "draft, not legally reviewed" banner until
 *   LEGAL_REVIEWED=true is set. Have a qualified lawyer review all pages for
 *   your jurisdiction and your marketplace agreements before publishing.
 */
import { site } from "@/config/site";

export type LegalBlock = string | { list: string[] };
export type LegalSection = { id: string; title: string; body: LegalBlock[] };
export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
  /** Items an owner must resolve before publication. */
  reviewNotes: string[];
};

const owner = site.legalOwner;
const brand = site.brand;
const tbc = (label: string, value: string | null | undefined) => value ?? `[[TO CONFIRM: ${label}]]`;

const contactEmail = tbc("contact email address", site.contact.email);
const privacyEmail = tbc("privacy contact email", site.legal.privacyContactEmail);
const jurisdiction = tbc("governing law / jurisdiction", site.legal.governingJurisdiction);
const address = tbc("registered business address", site.company.registeredAddress);
const refundDays = site.legal.refundWindowDays
  ? `${site.legal.refundWindowDays} days`
  : "[[TO CONFIRM: refund request window]]";

export const legalEffectiveDate = tbc("effective date", site.legal.effectiveDate);

const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  description: `How ${brand}, a brand of ${owner}, collects, uses, stores and protects personal information.`,
  intro: `This Privacy Policy explains how ${owner} (“we”, “us”), which operates the ${brand} brand and this website, handles personal information.`,
  reviewNotes: [
    "Confirm the legal entity, registered address and data-protection contact.",
    "Confirm which data-protection laws apply (e.g. GDPR/UK GDPR, NDPR, CCPA) and adapt rights and legal bases.",
    "List the actual email, hosting and analytics providers in use and any international transfers.",
    "Confirm retention periods against real business and legal needs.",
  ],
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        `${brand} is a software development and digital products brand owned by ${owner}. ${owner} is the controller of personal information collected through this website.`,
        `Registered address: ${address}`,
        `Privacy contact: ${privacyEmail}`,
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [
        "We aim to collect only what we need to handle each request.",
        {
          list: [
            "Enquiry and support forms: full name, email address, optional organisation, subject, enquiry type, your message and, for support requests, product name, version, environment and error details you choose to provide.",
            "Technical data: our hosting infrastructure may process IP address, browser type and request logs for security and reliability.",
            "Analytics: only if enabled (see the [Cookie Policy](/cookies)). We prefer privacy-friendly analytics and, where required, ask for your consent first.",
            "Purchases: if you buy a product through a third-party marketplace, that marketplace is responsible for collecting payment details. We do not collect card numbers through this website.",
          ],
        },
      ],
    },
    {
      id: "purposes",
      title: "How and why we use information",
      body: [
        {
          list: [
            "To respond to your enquiries and support requests.",
            "To provide, maintain and improve our products and services.",
            "To protect the website against spam, abuse and security threats.",
            "To meet legal and accounting obligations.",
            "To understand, in aggregate, how the website is used (only where analytics is enabled and any required consent has been given).",
          ],
        },
        "[[TO CONFIRM: legal bases for processing under the data-protection laws that apply to you]]",
      ],
    },
    {
      id: "sharing",
      title: "Sharing your information",
      body: [
        "We do not sell personal information. We share it only with:",
        {
          list: [
            "Service providers that help us operate the website and handle enquiries (for example, email delivery and hosting providers), under appropriate confidentiality and security commitments.",
            "Professional advisers, authorities or courts where required by law.",
            "A successor, if the business is sold or reorganised, subject to this policy.",
          ],
        },
        "[[TO CONFIRM: list the actual service providers and any international data transfers]]",
      ],
    },
    {
      id: "storage-retention",
      title: "Storage and retention",
      body: [
        "Enquiries and support messages are kept for as long as needed to resolve them and to maintain a reasonable record of our dealings, then deleted or anonymised.",
        "[[TO CONFIRM: specific retention periods, e.g. enquiries and support tickets]]",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We use reasonable technical and organisational measures to protect personal information, including encrypted connections (HTTPS), server-side validation, and restricted access to submitted enquiries. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal information, to object to certain processing, to data portability, and to withdraw consent. You may also complain to your local data-protection authority.",
        `To exercise these rights, contact ${privacyEmail}. We may need to verify your identity before acting on a request.`,
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["This website is not directed at children, and we do not knowingly collect their personal information."],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [`We may update this policy. The effective date above shows when it last changed. Material changes will be highlighted on this page.`],
    },
    {
      id: "contact",
      title: "Contact",
      body: [`${owner} — ${privacyEmail} — or use our [contact form](/contact).`],
    },
  ],
};

const termsOfService: LegalDoc = {
  slug: "terms-of-service",
  title: "Terms of Service",
  description: `The terms that apply to your use of the ${brand} website and services.`,
  intro: `These Terms of Service govern your use of the ${brand} website operated by ${owner}. By using the website you agree to them. Product purchases and licences are additionally governed by the [License Agreement](/license-agreement) and [Refund Policy](/refund-policy).`,
  reviewNotes: [
    "Confirm governing law, venue and limitation-of-liability wording for your jurisdiction.",
    "Confirm consistency with every marketplace's vendor and buyer terms.",
    "Decide whether separate SaaS terms and custom-development agreements are required.",
  ],
  sections: [
    {
      id: "about",
      title: "About these terms",
      body: [`The website is operated by ${owner}, the legal owner of the ${brand} brand. Contact: ${contactEmail}.`],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use of the website",
      body: [
        "You agree not to:",
        {
          list: [
            "use the website unlawfully or to infringe the rights of others;",
            "attempt to gain unauthorised access to systems, accounts or data;",
            "introduce malware, or disrupt or overload the website;",
            "scrape, copy or reverse engineer the website or products except as the law allows;",
            "submit false, misleading or abusive information through forms.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        `The website, the ${brand} name and logo, and our software, documentation and content are owned by or licensed to ${owner} and protected by intellectual-property laws. Nothing on the website transfers ownership to you. Use of a software product is governed by the [License Agreement](/license-agreement).`,
      ],
    },
    {
      id: "products-and-services",
      title: "Products, services and availability",
      body: [
        "Product descriptions are provided for information. Product availability, features and status (for example “In Development” or “Coming Soon”) may change. Custom development is provided under a written agreement that sets out scope, fees and delivery terms; in a conflict, that agreement prevails over these terms.",
        "Where you purchase through a third-party marketplace, the marketplace's terms also apply to that transaction.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party links and services",
      body: ["The website may link to third-party sites and marketplaces. We are not responsible for their content, availability or policies."],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and limitation of liability",
      body: [
        "The website is provided “as is” and “as available”. To the maximum extent permitted by law, we do not warrant that it will be uninterrupted or error-free, and we are not liable for indirect or consequential loss arising from its use. Nothing in these terms excludes liability that cannot lawfully be excluded.",
        "[[TO CONFIRM: liability cap and exclusions appropriate to your jurisdiction and contracts]]",
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: ["Our handling of personal information is described in the [Privacy Policy](/privacy-policy)."],
    },
    {
      id: "changes",
      title: "Changes",
      body: ["We may update these terms from time to time. Continued use of the website after an update means you accept the updated terms."],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [`These terms are governed by ${jurisdiction}.`],
    },
    {
      id: "contact",
      title: "Contact",
      body: [`Questions about these terms: ${contactEmail}, or use our [contact form](/contact).`],
    },
  ],
};

const refundPolicy: LegalDoc = {
  slug: "refund-policy",
  title: "Refund Policy",
  description: `How refunds work for ${brand} digital products, SaaS subscriptions and custom development.`,
  intro: `This policy explains how refund requests are handled for ${brand} offerings. It does not limit any rights you have under consumer-protection law that cannot be waived.`,
  reviewNotes: [
    "Decide the actual refund window and conditions for each offering, then set LEGAL_REFUND_WINDOW_DAYS.",
    "Align this policy with each marketplace's refund rules before listing on it.",
    "Confirm statutory consumer rights (e.g. withdrawal rights for digital content) in your target markets.",
  ],
  sections: [
    {
      id: "marketplace",
      title: "Purchases through third-party marketplaces",
      body: [
        "If you bought a product through a third-party marketplace, the marketplace is typically the seller of record and its refund policy and process apply. Please request the refund through that marketplace first. We will cooperate with the marketplace where we are able to.",
      ],
    },
    {
      id: "digital-products",
      title: "Digital products (downloads, source code, templates)",
      body: [
        "Digital products are delivered electronically and cannot be “returned”. Refund requests are assessed individually.",
        `Request window: ${refundDays} from purchase.`,
        "A refund may be considered where the product is materially different from its description, is defective and we are unable to correct the problem after reasonable support, or you were charged in error. A refund may not be available once the product has been downloaded or used, except where required by law.",
        "[[TO CONFIRM: exact conditions and exclusions for digital products]]",
      ],
    },
    {
      id: "saas",
      title: "SaaS subscriptions",
      body: [
        "You may cancel a subscription at any time to stop future renewals; access normally continues until the end of the paid period.",
        "[[TO CONFIRM: whether partial refunds, pro-rata refunds or a trial/cooling-off period apply to subscriptions]]",
      ],
    },
    {
      id: "custom-development",
      title: "Custom development services",
      body: [
        "Custom projects are governed by the written agreement for that project. Fees, milestones and any refund or cancellation terms are set out in that agreement, which takes priority over this policy.",
      ],
    },
    {
      id: "how-to-request",
      title: "How to request a refund",
      body: [
        "Contact us through the [Support Center](/support) with your order reference, the product name, the email used for purchase and the reason for your request. We will review it and reply with our decision.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: [`${owner} — ${contactEmail}`],
    },
  ],
};

const licenseAgreement: LegalDoc = {
  slug: "license-agreement",
  title: "License Agreement",
  description: `Software ownership, permitted use, redistribution and licensing terms for ${brand} products.`,
  intro: `This agreement describes how ${brand} software products, owned by ${owner}, may be used. A specific product page, order, or marketplace licence may add or replace terms; if so, the more specific terms apply to that product.`,
  reviewNotes: [
    "Define the actual licence types offered per product (single-site, multi-site, subscription, source-code, etc.).",
    "Check for conflicts with every marketplace's standard licence terms before listing.",
    "Decide the treatment of open-source components and list required notices.",
  ],
  sections: [
    {
      id: "ownership",
      title: "Ownership and copyright",
      body: [
        `All ${brand} software, source code, documentation, designs and related materials are owned by ${owner} (or its licensors) and protected by copyright and other intellectual-property laws. You receive a licence to use the software, not ownership of it.`,
      ],
    },
    {
      id: "grant",
      title: "Permitted use",
      body: [
        "Subject to payment of applicable fees and these terms, you receive a non-exclusive, non-transferable, revocable licence to install and use the software for the purposes and the number of sites, users or projects stated on your order or product page.",
        "[[TO CONFIRM: scope of the standard licence (users/sites/projects, personal vs. commercial use)]]",
      ],
    },
    {
      id: "restrictions",
      title: "Redistribution and modification",
      body: [
        "Unless your licence expressly says otherwise, you may not:",
        {
          list: [
            "resell, sublicense, redistribute, rent or share the software or its source code;",
            "remove copyright, branding or licence notices;",
            "use the software to build a competing product for resale;",
            "circumvent licence checks or technical protections.",
          ],
        },
        "Modification: you may configure the software and, where source code is supplied, modify it for your own permitted use. Modified versions remain subject to this agreement and may not be redistributed unless a licence says so. [[TO CONFIRM: modification rights per product]]",
      ],
    },
    {
      id: "commercial",
      title: "Commercial licensing options",
      body: [
        "Only the licence options listed on a product's page are available for that product. For other arrangements (such as extended, multi-site or white-label rights), please [contact us](/contact) to discuss; nothing is granted until agreed in writing.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party and open-source components",
      body: ["Some products include third-party or open-source components that are licensed under their own terms, which apply to those components. [[TO CONFIRM: list notices per product]]"],
    },
    {
      id: "updates-support",
      title: "Updates and support",
      body: ["Updates and support are provided as described on the relevant product page or order. See the [Support Center](/support)."],
    },
    {
      id: "warranty",
      title: "Warranty disclaimer and liability",
      body: [
        "To the maximum extent permitted by law, software is provided “as is” without warranties of any kind, and we are not liable for indirect or consequential loss. Nothing excludes liability that cannot lawfully be excluded.",
        "[[TO CONFIRM: warranty and liability wording for your jurisdiction]]",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      body: ["Your licence ends automatically if you materially breach this agreement. On termination you must stop using the software and delete copies you hold."],
    },
    {
      id: "marketplaces",
      title: "Marketplace purchases",
      body: ["If you purchased through a third-party marketplace, that marketplace's licence terms may also apply. Where they conflict with this agreement, [[TO CONFIRM: which terms prevail per marketplace]]."],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [`This agreement is governed by ${jurisdiction}.`],
    },
  ],
};

const cookiePolicy: LegalDoc = {
  slug: "cookies",
  title: "Cookie Policy",
  description: `How the ${brand} website uses cookies and similar technologies.`,
  intro: `This policy explains how this website, operated by ${owner}, uses cookies and similar technologies, and how you can control them.`,
  reviewNotes: [
    "Update this page whenever analytics or other non-essential technologies are added.",
    "If you serve visitors in the EU/UK, ensure consent handling meets local requirements.",
  ],
  sections: [
    {
      id: "what",
      title: "What are cookies?",
      body: ["Cookies are small text files stored on your device. Similar technologies include local storage and tracking pixels."],
    },
    {
      id: "essential",
      title: "What this website uses by default",
      body: [
        "By default this website sets no advertising or tracking cookies. It may store a small, strictly necessary item in your browser to remember your cookie choice (when a banner is shown). The contact and support forms do not use cookies.",
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      body: [
        site.analytics.plausibleDomain
          ? `This site uses Plausible Analytics, a privacy-focused service that does not use cookies and does not collect personal data. ${site.analytics.requiresConsent ? "It loads only if you accept analytics in the cookie banner." : ""}`
          : "No analytics service is currently enabled. If we enable one, we will describe it here and, where required, ask for your consent first.",
      ],
    },
    {
      id: "third-party",
      title: "Third-party services",
      body: [
        site.turnstileSiteKey
          ? "Our forms may use Cloudflare Turnstile to block automated spam. It may process technical information about your browser."
          : "Our forms use first-party spam protection that does not rely on third-party tracking.",
        "Links to marketplaces and other external sites are governed by their own cookie policies.",
      ],
    },
    {
      id: "control",
      title: "Your choices",
      body: ["You can block or delete cookies in your browser settings. Where a consent banner is shown, you can change your choice by clearing this site's stored data and reloading."],
    },
    {
      id: "contact",
      title: "Contact",
      body: [`Questions: ${privacyEmail}, or use our [contact form](/contact).`],
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "refund-policy": refundPolicy,
  "license-agreement": licenseAgreement,
  cookies: cookiePolicy,
};
