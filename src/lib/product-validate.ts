import { productCategories, productStatuses, type Product } from "@/content/products";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTTPS_RE = /^https:\/\/[^\s<>"']+$/i;
const IMG_RE = /^(\/media\/[a-f0-9]{24}|\/products\/[A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|gif|svg))$/;

type Raw = Record<string, unknown>;
export type ProductResult = { ok: true; product: Product } | { ok: false; errors: string[] };

const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null && !Array.isArray(v);
const clean = (v: unknown) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim() : "");

/** Server-side validation + normalisation of an admin-submitted product. Never trust the client form. */
export function validateProduct(input: unknown, opts: { slug?: string } = {}): ProductResult {
  const errors: string[] = [];
  if (!isObj(input)) return { ok: false, errors: ["Invalid request."] };

  const str = (key: string, label: string, max: number, required = false): string => {
    const v = clean(input[key]);
    if (required && !v) errors.push(`${label} is required.`);
    if (v.length > max) errors.push(`${label} must be ${max} characters or fewer.`);
    return v;
  };
  const list = (key: string, label: string, required = false, maxItems = 20, maxLen = 200): string[] => {
    const raw = Array.isArray(input[key]) ? input[key] : [];
    const out = raw.map(clean).filter(Boolean);
    if (required && out.length === 0) errors.push(`${label}: add at least one item.`);
    if (out.length > maxItems) errors.push(`${label}: at most ${maxItems} items.`);
    if (out.some((x) => x.length > maxLen)) errors.push(`${label}: each item must be ${maxLen} characters or fewer.`);
    return out;
  };
  const url = (v: string, label: string, allowInternal = false) => {
    if (HTTPS_RE.test(v) || (allowInternal && /^\/[A-Za-z0-9_\-./#?=&%]*$/.test(v))) return;
    errors.push(`${label}: enter a full link starting with https://${allowInternal ? " (or a /path on this site)" : ""}.`);
  };
  const rows = (key: string): Raw[] => (Array.isArray(input[key]) ? input[key].filter(isObj) : []);

  const slug = opts.slug ?? clean(input.slug).toLowerCase();
  if (!SLUG_RE.test(slug) || slug.length > 60) errors.push("Web address (slug): use lowercase letters, numbers and hyphens only, up to 60 characters.");

  const name = str("name", "Product name", 80, true);
  const category = clean(input.category);
  if (!(productCategories as readonly string[]).includes(category)) errors.push("Choose a category.");
  const status = clean(input.status);
  if (!(status in productStatuses)) errors.push("Choose a status.");

  const product: Product = {
    slug,
    name,
    published: input.published === true,
    category: category as Product["category"],
    status: status as Product["status"],
    shortDescription: str("shortDescription", "Short description", 220, true),
    overview: str("overview", "Overview", 4000, true),
    audience: list("audience", "Intended users", true, 10, 120),
    capabilities: list("capabilities", "Key capabilities", true, 15, 160),
  };

  const features = rows("features").map((r) => ({ title: clean(r.title), description: clean(r.description) })).filter((f) => f.title || f.description);
  if (features.some((f) => !f.title || !f.description)) errors.push("Features: each needs a title and a description.");
  if (features.length > 20) errors.push("Features: at most 20.");
  if (features.length) product.features = features;

  const shots = rows("screenshots").map((r) => ({
    src: clean(r.src), alt: clean(r.alt), width: Math.round(Number(r.width)), height: Math.round(Number(r.height)),
  }));
  shots.forEach((s, i) => {
    if (!IMG_RE.test(s.src)) errors.push(`Screenshot ${i + 1}: invalid image.`);
    if (!s.alt) errors.push(`Screenshot ${i + 1}: add a short description (alt text) of what it shows.`);
    if (!(s.width > 0 && s.width <= 8000 && s.height > 0 && s.height <= 8000)) errors.push(`Screenshot ${i + 1}: invalid dimensions.`);
  });
  if (shots.length > 12) errors.push("Screenshots: at most 12.");
  if (shots.length) product.screenshots = shots;

  const logoSrc = clean(isObj(input.logo) ? input.logo.src : "");
  if (logoSrc) {
    const alt = clean((input.logo as Raw).alt) || `${name} logo`;
    if (!IMG_RE.test(logoSrc)) errors.push("Logo: invalid image.");
    product.logo = { src: logoSrc, alt };
  }

  const opt = (key: keyof Product, v: string[]) => { if (v.length) (product as Record<string, unknown>)[key] = v; };
  opt("requirements", list("requirements", "Technical requirements"));
  opt("platforms", list("platforms", "Supported platforms"));
  opt("deployment", list("deployment", "Deployment options"));
  opt("installation", list("installation", "Installation steps", false, 30, 400));

  const pricingDisplay = str("pricingDisplay", "Price", 80);
  const pricingNote = str("pricingNote", "Price note", 200);
  if (pricingDisplay) product.pricing = { display: pricingDisplay, ...(pricingNote ? { note: pricingNote } : {}) };
  else if (pricingNote) errors.push("Price note needs a price.");

  const licensing = str("licensing", "Licensing", 1000); if (licensing) product.licensing = licensing;
  const updatePolicy = str("updatePolicy", "Updates and maintenance", 1000); if (updatePolicy) product.updatePolicy = updatePolicy;
  const supportNote = str("supportNote", "Support note", 500); if (supportNote) product.supportNote = supportNote;
  const version = str("version", "Version", 40); if (version) product.version = version;

  const docs = rows("documentation").map((r) => ({ label: clean(r.label), href: clean(r.href) })).filter((d) => d.label || d.href);
  docs.forEach((d, i) => { if (!d.label) errors.push(`Documentation link ${i + 1}: add a label.`); url(d.href, `Documentation link ${i + 1}`, true); });
  if (docs.length > 15) errors.push("Documentation links: at most 15.");
  if (docs.length) product.documentation = docs;

  const buys = rows("purchaseLinks").map((r) => ({ label: clean(r.label), href: clean(r.href), channel: clean(r.channel) })).filter((d) => d.label || d.href || d.channel);
  buys.forEach((b, i) => {
    if (!b.label) errors.push(`Purchase link ${i + 1}: add button text.`);
    if (!b.channel) errors.push(`Purchase link ${i + 1}: say where it is sold (e.g. "Bridgecodes website").`);
    url(b.href, `Purchase link ${i + 1}`, true);
  });
  if (buys.length > 6) errors.push("Purchase links: at most 6.");
  if (buys.length) product.purchaseLinks = buys;

  const payHref = str("paymentHref", "Payment link", 500);
  const payProvider = str("paymentProvider", "Payment provider", 40);
  if (payHref) {
    url(payHref, "Payment link");
    product.paymentLink = { href: payHref, ...(payProvider ? { provider: payProvider } : {}) };
  }

  const trialLabel = isObj(input.trialLink) ? clean(input.trialLink.label) : "";
  const trialHref = isObj(input.trialLink) ? clean(input.trialLink.href) : "";
  if (trialLabel || trialHref) {
    if (!trialLabel) errors.push("Demo link: add button text.");
    url(trialHref, "Demo link", true);
    product.trialLink = { label: trialLabel, href: trialHref };
  }

  if (product.status === "available" && product.published && !product.purchaseLinks?.length) {
    // Allowed (enquiry CTA is shown), but keep the rule explicit for future changes.
  }
  return errors.length ? { ok: false, errors } : { ok: true, product };
}
