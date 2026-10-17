export type Service = {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  scope: string[];
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "custom-software-development",
    name: "Custom Software Development",
    icon: "code",
    summary: "Purpose-built software designed around how your organisation actually works.",
    scope: [
      "Requirements discovery and technical scoping",
      "Architecture and technology selection",
      "Iterative design, development and testing",
      "Deployment and handover",
    ],
    deliverables: [
      "Scoping document and agreed requirements",
      "Working software delivered in reviewable increments",
      "Source code and technical documentation (as agreed in the contract)",
      "Deployment and handover notes",
    ],
  },
  {
    slug: "web-application-development",
    name: "Web Application Development",
    icon: "layers",
    summary: "Responsive, secure web applications, portals and dashboards.",
    scope: [
      "Front-end and back-end development",
      "Authentication, roles and permissions",
      "Dashboards, reporting and data management",
      "Performance and accessibility considerations",
    ],
    deliverables: [
      "Deployed web application",
      "Admin and user workflows as specified",
      "Automated and manual test coverage for agreed scope",
      "User and technical documentation",
    ],
  },
  {
    slug: "mobile-application-development",
    name: "Mobile Application Development",
    icon: "smartphone",
    summary: "Mobile applications for customers, staff or field teams.",
    scope: [
      "Mobile UX and interface design",
      "Cross-platform or platform-specific builds, depending on requirements",
      "Back-end and API connectivity",
      "Preparation for app-store submission",
    ],
    deliverables: [
      "Tested mobile application builds",
      "Supporting API or back-end services where required",
      "Release notes and submission assistance",
      "Documentation for maintenance",
    ],
  },
  {
    slug: "saas-product-development",
    name: "SaaS Product Development",
    icon: "cloud",
    summary: "Subscription software platforms built to be maintained and extended.",
    scope: [
      "Multi-tenant architecture and data modelling",
      "Account, billing and subscription integration",
      "Admin tooling and operational monitoring",
      "Roadmap planning and incremental releases",
    ],
    deliverables: [
      "Production-ready SaaS application",
      "Infrastructure and deployment configuration",
      "Operational and administrator documentation",
      "Release and maintenance plan",
    ],
  },
  {
    slug: "business-process-automation",
    name: "Business Process Automation",
    icon: "workflow",
    summary: "Reduce repetitive manual work by automating approvals, data flows and reporting.",
    scope: [
      "Process review and automation opportunities",
      "Workflow design and implementation",
      "Integration between existing tools",
      "Monitoring, logging and error handling",
    ],
    deliverables: [
      "Documented workflows",
      "Implemented automations and integrations",
      "Operating instructions for your team",
      "Support options for ongoing changes",
    ],
  },
  {
    slug: "e-commerce-development",
    name: "E-commerce Development",
    icon: "cart",
    summary: "Online stores and commerce features tailored to your catalogue and operations.",
    scope: [
      "Storefront design and development",
      "Catalogue, checkout and payment integration",
      "Order and inventory workflows",
      "Integration with existing back-office tools",
    ],
    deliverables: [
      "Deployed storefront or commerce extension",
      "Payment and fulfilment integrations as scoped",
      "Admin guidance for your team",
      "Documentation of custom components",
    ],
  },
  {
    slug: "api-development-and-integration",
    name: "API Development and Integration",
    icon: "plug",
    summary: "Well-documented APIs and reliable connections between your systems.",
    scope: [
      "REST API design and implementation",
      "Third-party service integration",
      "Authentication and rate-limiting strategy",
      "Versioning and documentation",
    ],
    deliverables: [
      "Deployed API or integration layer",
      "API reference documentation",
      "Test suite for agreed endpoints",
      "Integration and troubleshooting notes",
    ],
  },
  {
    slug: "software-maintenance-and-support",
    name: "Software Maintenance and Technical Support",
    icon: "lifebuoy",
    summary: "Ongoing updates, fixes and technical assistance for software we build or maintain.",
    scope: [
      "Bug fixing and dependency updates",
      "Minor enhancements and configuration changes",
      "Technical assistance for your team",
      "Review of security and stability concerns",
    ],
    deliverables: [
      "Maintenance releases",
      "Written summary of changes made",
      "Support arrangements as defined in your agreement",
    ],
  },
];

export const serviceProcess = [
  {
    title: "Understand the problem",
    text: "We begin with your goals, users, constraints and existing systems before proposing any technology.",
  },
  {
    title: "Plan the solution",
    text: "We agree scope, milestones, responsibilities and the approach to delivery in writing.",
  },
  {
    title: "Design and develop",
    text: "We build in reviewable increments so you can see progress and give feedback early.",
  },
  {
    title: "Deploy, support, and improve",
    text: "We release, document, hand over, and discuss ongoing support and improvements.",
  },
] as const;

export const serviceFaqs = [
  {
    q: "How are projects priced?",
    a: "Pricing depends on scope, complexity and timeline. We do not publish fixed service prices. After an initial conversation we provide a written proposal for your review.",
  },
  {
    q: "Who owns the source code of custom work?",
    a: "Ownership and licensing of delivered work are defined in the project agreement. We agree this with you in writing before work begins.",
  },
  {
    q: "Can you work with software we already have?",
    a: "Yes, subject to review. We can assess an existing system and propose maintenance, integration or modernisation work.",
  },
  {
    q: "How do we start a project?",
    a: "Send an enquiry through the contact form, choosing “Custom Development”. Describe the problem, your users and any deadlines, and we will reply to discuss next steps.",
  },
  {
    q: "What happens after delivery?",
    a: "We provide documentation and handover notes. Ongoing maintenance and support can be agreed separately; the terms are set out in your agreement.",
  },
];
