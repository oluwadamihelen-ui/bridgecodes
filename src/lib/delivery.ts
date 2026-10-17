import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { formSpecs, type EnquiryKind, type FieldName } from "./enquiry-schema";

type Enquiry = { kind: EnquiryKind; values: Partial<Record<FieldName, string>> };

const env = (k: string) => process.env[k]?.trim() || undefined;

export const deliveryConfigured = () =>
  Boolean((env("RESEND_API_KEY") && env("ENQUIRY_FROM_EMAIL") && env("ENQUIRY_TO_EMAIL")) || env("ENQUIRY_STORE_DIR"));

const kindLabel: Record<EnquiryKind, string> = {
  contact: "Contact enquiry",
  support: "Support request",
  bug: "Bug report",
  purchase: "Purchase enquiry",
  demo: "Demo request",
};

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 200);

function renderText(id: string, e: Enquiry): string {
  const lines = [`${kindLabel[e.kind]}  (ref: ${id})`, ""];
  for (const f of formSpecs[e.kind].fields) {
    const v = e.values[f.name];
    if (v) lines.push(`${f.label.replace(/ \(optional\)$/, "")}:`, v, "");
  }
  return lines.join("\n");
}

async function sendEmail(id: string, e: Enquiry): Promise<void> {
  const apiKey = env("RESEND_API_KEY")!;
  const from = env("ENQUIRY_FROM_EMAIL")!;
  const to =
    (e.kind === "support" || e.kind === "bug") && env("SUPPORT_TO_EMAIL") ? env("SUPPORT_TO_EMAIL")! : env("ENQUIRY_TO_EMAIL")!;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": id,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: e.values.email,
      subject: `[Bridgecodes ${kindLabel[e.kind]}] ${oneLine(e.values.subject ?? "")}`,
      text: renderText(id, e), // plain text only: no HTML injection surface
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
}

async function persist(id: string, e: Enquiry): Promise<void> {
  const dir = path.resolve(/*turbopackIgnore: true*/ env("ENQUIRY_STORE_DIR")!);
  await mkdir(dir, { recursive: true });
  const record = { id, receivedAt: new Date().toISOString(), kind: e.kind, ...e.values };
  await appendFile(path.join(dir, "enquiries.jsonl"), JSON.stringify(record) + "\n", { mode: 0o600 });
}

/** Delivers via every configured channel. Resolves with the reference if at least one succeeded. */
export async function deliverEnquiry(e: Enquiry): Promise<string> {
  const id = randomUUID();
  const jobs: Promise<void>[] = [];
  if (env("RESEND_API_KEY") && env("ENQUIRY_FROM_EMAIL") && env("ENQUIRY_TO_EMAIL")) jobs.push(sendEmail(id, e));
  if (env("ENQUIRY_STORE_DIR")) jobs.push(persist(id, e));
  if (!jobs.length) throw new Error("NOT_CONFIGURED");

  const results = await Promise.allSettled(jobs);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("[forms] delivery channel failed:", f.reason instanceof Error ? f.reason.message : "unknown"));
  if (failures.length === results.length) throw new Error("DELIVERY_FAILED");
  return id;
}
