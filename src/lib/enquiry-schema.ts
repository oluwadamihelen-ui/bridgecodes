/** Shared (client + server) definition of the enquiry forms. Server re-validates everything. */

export const enquiryKinds = ["contact", "support", "bug", "purchase"] as const;
export type EnquiryKind = (typeof enquiryKinds)[number];

export const contactTypes = [
  "General Enquiry",
  "Product Sales",
  "Technical Support",
  "Custom Development",
  "Partnership",
  "Licensing",
  "Other",
] as const;

export const supportTypes = [
  "Technical support",
  "Installation or configuration help",
  "Licence or order question",
  "Other support question",
] as const;

export type FieldName =
  | "name"
  | "email"
  | "company"
  | "subject"
  | "enquiryType"
  | "message"
  | "product"
  | "version"
  | "environment"
  | "steps";

export type FieldSpec = {
  name: FieldName;
  label: string;
  required: boolean;
  max: number;
  type: "text" | "email" | "textarea" | "select" | "hidden";
  options?: readonly string[];
  hint?: string;
  rows?: number;
  autoComplete?: string;
};

const base: Record<string, FieldSpec> = {
  name: { name: "name", label: "Full name", required: true, max: 100, type: "text", autoComplete: "name" },
  email: { name: "email", label: "Business email", required: true, max: 254, type: "email", autoComplete: "email" },
  company: { name: "company", label: "Company or organization (optional)", required: false, max: 150, type: "text", autoComplete: "organization" },
  subject: { name: "subject", label: "Subject", required: true, max: 150, type: "text" },
};

export const formSpecs: Record<EnquiryKind, { title: string; submitLabel: string; fields: FieldSpec[] }> = {
  purchase: {
    title: "Your details",
    submitLabel: "Send purchase enquiry",
    fields: [
      base.name,
      { ...base.email, label: "Email" },
      base.company,
      { name: "product", label: "Product", required: true, max: 120, type: "text" },
      { name: "subject", label: "Subject", required: true, max: 150, type: "hidden" },
      { name: "message", label: "What do you need?", required: false, max: 3000, type: "textarea", rows: 5, hint: "For example: how many users or sites, whether you need a particular licence, and your timeline." },
    ],
  },
  contact: {
    title: "Send us a message",
    submitLabel: "Send message",
    fields: [
      base.name,
      base.email,
      base.company,
      base.subject,
      { name: "enquiryType", label: "Enquiry type", required: true, max: 60, type: "select", options: contactTypes },
      { name: "message", label: "Message", required: true, max: 5000, type: "textarea", rows: 7 },
    ],
  },
  support: {
    title: "Technical support request",
    submitLabel: "Submit support request",
    fields: [
      base.name,
      { ...base.email, label: "Email" },
      { name: "product", label: "Product name", required: true, max: 120, type: "text" },
      { name: "version", label: "Product version (optional)", required: false, max: 60, type: "text" },
      { name: "enquiryType", label: "Request type", required: true, max: 60, type: "select", options: supportTypes },
      { ...base.subject, label: "Summary" },
      { name: "environment", label: "Environment (optional)", required: false, max: 300, type: "text", hint: "Operating system, browser, hosting or database, if relevant." },
      { name: "message", label: "Describe the issue", required: true, max: 5000, type: "textarea", rows: 7, hint: "Include any error messages exactly as shown." },
    ],
  },
  bug: {
    title: "Report a bug",
    submitLabel: "Submit bug report",
    fields: [
      base.name,
      { ...base.email, label: "Email" },
      { name: "product", label: "Product name", required: true, max: 120, type: "text" },
      { name: "version", label: "Product version", required: true, max: 60, type: "text" },
      { ...base.subject, label: "Bug summary" },
      { name: "environment", label: "Environment (optional)", required: false, max: 300, type: "text", hint: "Operating system, browser, hosting or database." },
      { name: "steps", label: "Steps to reproduce", required: true, max: 3000, type: "textarea", rows: 5 },
      { name: "message", label: "Expected vs. actual result, and error details", required: true, max: 5000, type: "textarea", rows: 6 },
    ],
  },
};
