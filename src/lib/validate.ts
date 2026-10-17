import { enquiryKinds, formSpecs, type EnquiryKind, type FieldName } from "./enquiry-schema";

export type ValidEnquiry = { kind: EnquiryKind; values: Partial<Record<FieldName, string>> };
export type ValidationResult =
  | { ok: true; data: ValidEnquiry }
  | { ok: false; errors: Partial<Record<FieldName | "form", string>> };

// Pragmatic RFC-5322-ish check: one "@", no spaces, a dotted domain.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function validateEnquiry(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) return { ok: false, errors: { form: "Invalid request." } };
  const raw = input as Record<string, unknown>;

  const kind = raw.kind;
  if (typeof kind !== "string" || !(enquiryKinds as readonly string[]).includes(kind)) {
    return { ok: false, errors: { form: "Unknown form type." } };
  }
  const spec = formSpecs[kind as EnquiryKind];
  const errors: Partial<Record<FieldName, string>> = {};
  const values: Partial<Record<FieldName, string>> = {};

  for (const f of spec.fields) {
    const v = raw[f.name];
    const text = typeof v === "string" ? v.replace(CONTROL, "").replace(/\r\n/g, "\n").trim() : "";
    const label = f.label.replace(/ \(optional\)$/, "");

    if (!text) {
      if (f.required) errors[f.name] = `${label} is required.`;
      continue;
    }
    if (text.length > f.max) {
      errors[f.name] = `${label} must be ${f.max} characters or fewer.`;
      continue;
    }
    if (f.type === "email" && !EMAIL_RE.test(text)) {
      errors[f.name] = "Enter a valid email address.";
      continue;
    }
    if (f.type === "select" && !f.options?.includes(text)) {
      errors[f.name] = `Choose a valid ${label.toLowerCase()}.`;
      continue;
    }
    if (f.type !== "textarea" && /\n/.test(text)) {
      errors[f.name] = `${label} must be a single line.`;
      continue;
    }
    if (f.name === "message" && text.length < 10) {
      errors[f.name] = "Please provide a little more detail (at least 10 characters).";
      continue;
    }
    values[f.name] = text;
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { kind: kind as EnquiryKind, values } };
}
