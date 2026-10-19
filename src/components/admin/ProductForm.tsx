"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { productCategories, productStatuses, type Product } from "@/content/products";
import { resourceCategories } from "@/content/resources";

type Row = Record<string, string>;
type Shot = { src: string; alt: string; width: number; height: number };

const lines = (v?: string[]) => (v ?? []).join("\n");
/** Keeps what is typed valid as a web address: lowercase, hyphens for spaces/underscores, no symbols. */
const liveSlug = (s: string) => s.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").replace(/^-+/, "").slice(0, 60);
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/** Resize to maxDim and re-encode as WebP (JPEG fallback) so uploads stay small. */
async function compress(file: File, maxDim: number): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale), height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  for (const [type, q] of [["image/webp", 0.85], ["image/webp", 0.7], ["image/jpeg", 0.7]] as const) {
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, type, q));
    if (blob && blob.size <= 680 * 1024) return { blob, width, height };
  }
  throw new Error("That image is too large even after compression. Try a smaller one.");
}

async function uploadImage(file: File, maxDim: number): Promise<{ src: string; width: number; height: number }> {
  const { blob, width, height } = await compress(file, maxDim);
  const fd = new FormData();
  fd.append("file", blob, "upload");
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? "Upload failed.");
  return { src: data.src, width, height };
}

function Field({ label, hint, children, id, error }: { label: string; hint?: string; children: React.ReactNode; id: string; error?: string }) {
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

function Rows({ title, hint, rows, setRows, cols, addLabel }: {
  title: string; hint?: string; rows: Row[]; setRows: (r: Row[]) => void; addLabel: string;
  cols: { key: string; label: string; placeholder?: string; wide?: boolean; options?: { value: string; label: string }[] }[];
}) {
  const uid = useId();
  return (
    <fieldset className="admin__group">
      <legend>{title}</legend>
      {hint && <p className="hint" style={{ marginTop: 0 }}>{hint}</p>}
      {rows.map((row, i) => (
        <div className="admin__row" key={i}>
          {cols.map((c) => (
            <div className="field" key={c.key} style={c.wide ? { flex: 2 } : undefined}>
              <label htmlFor={`${uid}-${i}-${c.key}`}>{c.label}</label>
              {c.options ? (
                <select id={`${uid}-${i}-${c.key}`} value={row[c.key] ?? ""}
                  onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, [c.key]: e.target.value } : r)))}>
                  {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input id={`${uid}-${i}-${c.key}`} type="text" value={row[c.key] ?? ""} placeholder={c.placeholder}
                  onChange={(e) => setRows(rows.map((r, j) => (j === i ? { ...r, [c.key]: e.target.value } : r)))} />
              )}
            </div>
          ))}
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label={`Remove ${title} row ${i + 1}`}>Remove</button>
        </div>
      ))}
      <div className="btn-row">
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => setRows([...rows, {}])}>{addLabel}</button>
      </div>
    </fieldset>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const editing = Boolean(product);
  const uid = useId();
  const topRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [published, setPublished] = useState(product?.published ?? false);
  const [status, setStatus] = useState<string>(product?.status ?? "in-development");
  const [category, setCategory] = useState<string>(product?.category ?? "");
  const [shortDescription, setShort] = useState(product?.shortDescription ?? "");
  const [overview, setOverview] = useState(product?.overview ?? "");
  const [audience, setAudience] = useState(lines(product?.audience));
  const [capabilities, setCapabilities] = useState(lines(product?.capabilities));
  const [features, setFeatures] = useState<Row[]>(product?.features ?? []);
  const [shots, setShots] = useState<Shot[]>(product?.screenshots ?? []);
  const [logo, setLogo] = useState(product?.logo ?? null);
  const [requirements, setRequirements] = useState(lines(product?.requirements));
  const [platforms, setPlatforms] = useState(lines(product?.platforms));
  const [deployment, setDeployment] = useState(lines(product?.deployment));
  const [pricingDisplay, setPricingDisplay] = useState(product?.pricing?.display ?? "");
  const [pricingNote, setPricingNote] = useState(product?.pricing?.note ?? "");
  const [licensing, setLicensing] = useState(product?.licensing ?? "");
  const [installation, setInstallation] = useState(lines(product?.installation));
  const [documentation, setDocumentation] = useState<Row[]>((product?.documentation ?? []) as Row[]);
  const [updatePolicy, setUpdatePolicy] = useState(product?.updatePolicy ?? "");
  const [supportNote, setSupportNote] = useState(product?.supportNote ?? "");
  const [version, setVersion] = useState(product?.version ?? "");
  const [purchaseLinks, setPurchaseLinks] = useState<Row[]>(product?.purchaseLinks ?? []);
  const [paymentHref, setPaymentHref] = useState(product?.paymentLink?.href ?? "");
  const [paymentProvider, setPaymentProvider] = useState(product?.paymentLink?.provider ?? "");
  const [trialLabel, setTrialLabel] = useState(product?.trialLink?.label ?? "");
  const [trialHref, setTrialHref] = useState(product?.trialLink?.href ?? "");

  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState("");

  const split = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  async function addShots(files: FileList | null) {
    if (!files?.length) return;
    setUploading("Uploading screenshots…"); setErrors([]);
    try {
      const added: Shot[] = [];
      for (const f of Array.from(files)) added.push({ ...(await uploadImage(f, 1600)), alt: "" });
      setShots((s) => [...s, ...added]);
    } catch (e) { setErrors([e instanceof Error ? e.message : "Upload failed."]); }
    setUploading("");
  }
  async function setLogoFile(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading("Uploading logo…"); setErrors([]);
    try { const r = await uploadImage(files[0], 512); setLogo({ src: r.src, alt: `${name || "Product"} logo`, width: r.width, height: r.height }); }
    catch (e) { setErrors([e instanceof Error ? e.message : "Upload failed."]); }
    setUploading("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]); setFieldErrors({});
    const missing: Record<string, string> = {};
    if (!name.trim()) missing.name = "Enter the product name.";
    if (!slug.replace(/-+$/, "")) missing.slug = "Enter a web address using English letters or numbers, for example my-product (it is filled in automatically from the name).";
    if (!category) missing.category = "Choose a category.";
    if (!shortDescription.trim()) missing.short = "Add a short description.";
    if (!overview.trim()) missing.overview = "Add an overview.";
    if (!split(audience).length) missing.aud = "Add at least one intended user, one per line.";
    if (!split(capabilities).length) missing.cap = "Add at least one capability, one per line.";
    const firstMissing = Object.keys(missing)[0];
    if (firstMissing) {
      setFieldErrors(missing);
      setErrors([`${Object.keys(missing).length} required ${Object.keys(missing).length === 1 ? "field is" : "fields are"} empty. They are marked in red below.`]);
      const el = document.getElementById(id(firstMissing));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setBusy(true);
    const cleanSlug = slug.replace(/-+$/, "");
    setSlug(cleanSlug);
    const payload = {
      slug: cleanSlug, name, published, status, category, shortDescription, overview,
      audience: split(audience), capabilities: split(capabilities),
      features, screenshots: shots, logo: logo ?? undefined,
      requirements: split(requirements), platforms: split(platforms), deployment: split(deployment),
      pricingDisplay, pricingNote, licensing, installation: split(installation), documentation,
      updatePolicy, supportNote, version, purchaseLinks, paymentHref, paymentProvider, trialLink: { label: trialLabel, href: trialHref },
    };
    try {
      const res = await fetch(editing ? `/api/admin/products/${encodeURIComponent(product!.slug)}` : "/api/admin/products", {
        method: editing ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { router.push(`/admin?saved=${encodeURIComponent(data.slug)}`); router.refresh(); return; }
      setErrors(data.errors ?? [data.message ?? "Could not save."]);
    } catch { setErrors(["Network error. Please try again."]); }
    setBusy(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const id = (k: string) => `${uid}-${k}`;

  return (
    <form className="form admin__form" onSubmit={onSubmit} noValidate>
      <div ref={topRef} tabIndex={-1}>
        {errors.length > 0 && (
          <div className="notice notice--error" role="alert">
            <strong>Please fix the following:</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>{errors.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        )}
      </div>

      <p className="hint" style={{ margin: 0 }}>Fields marked <span className="req">*</span> are required. Everything else is optional.</p>

      <fieldset className="admin__group">
        <legend>Basics</legend>
        <Field id={id("name")} label="Product name *" error={fieldErrors.name}>
          <input id={id("name")} type="text" value={name} maxLength={80} required
            onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} />
        </Field>
        <Field id={id("slug")} label="Web address *" error={fieldErrors.slug} hint={editing ? "The address cannot be changed after the product is created." : `Appears as /products/${slug || "your-product"}. Letters, numbers and hyphens.`}>
          <input id={id("slug")} type="text" value={slug} maxLength={60} required readOnly={editing}
            onChange={(e) => { setSlugTouched(true); setSlug(liveSlug(e.target.value)); }}
            onBlur={() => setSlug((v) => v.replace(/-+$/, ""))} />
        </Field>
        <div className="admin__cols">
          <Field id={id("category")} label="Category *" error={fieldErrors.category}>
            <select id={id("category")} value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="" disabled>Select…</option>
              {productCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field id={id("status")} label="Status *" hint="Be honest: use In Development or Coming Soon until it can be bought or used.">
            <select id={id("status")} value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(productStatuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
        </div>
        <label className="admin__check">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <span><strong>Published</strong> — show this product on the website. Leave unticked to keep it as a hidden draft.</span>
        </label>
      </fieldset>

      <fieldset className="admin__group">
        <legend>Description</legend>
        <Field id={id("short")} label="Short description *" error={fieldErrors.short} hint="One or two sentences, shown on the product card.">
          <textarea id={id("short")} rows={2} maxLength={220} value={shortDescription} onChange={(e) => setShort(e.target.value)} required />
        </Field>
        <Field id={id("overview")} label="Overview *" error={fieldErrors.overview} hint="What it does and the problem it solves. Facts only.">
          <textarea id={id("overview")} rows={6} maxLength={4000} value={overview} onChange={(e) => setOverview(e.target.value)} required />
        </Field>
        <div className="admin__cols">
          <Field id={id("aud")} label="Intended users * (one per line)" error={fieldErrors.aud}>
            <textarea id={id("aud")} rows={4} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={"Small businesses\nSchool administrators"} />
          </Field>
          <Field id={id("cap")} label="Key capabilities * (one per line)" error={fieldErrors.cap}>
            <textarea id={id("cap")} rows={4} value={capabilities} onChange={(e) => setCapabilities(e.target.value)} placeholder={"Invoicing\nReporting"} />
          </Field>
        </div>
      </fieldset>

      <Rows title="Features (optional)" rows={features} setRows={setFeatures} addLabel="Add feature"
        cols={[{ key: "title", label: "Title" }, { key: "description", label: "Description", wide: true }]} />

      <fieldset className="admin__group">
        <legend>Images (optional)</legend>
        <p className="hint" style={{ marginTop: 0 }}>Only upload real screenshots of the product. They appear as a swipeable carousel on the website; the first image is the cover. Images are resized and compressed automatically.</p>
        <div className="admin__thumbs">
          {shots.map((s, i) => (
            <div className="admin__thumb" key={s.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" width={160} />
              <div className="field">
                <label htmlFor={id(`alt${i}`)}>What does it show? *</label>
                <input id={id(`alt${i}`)} type="text" value={s.alt} onChange={(e) => setShots(shots.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} placeholder="Dashboard showing monthly invoices" />
              </div>
              <div className="btn-row">
                {i > 0 && <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShots([shots[i], ...shots.filter((_, j) => j !== i)])}>Make first</button>}
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShots(shots.filter((_, j) => j !== i))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <Field id={id("shots")} label="Add screenshots"><input id={id("shots")} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={(e) => { addShots(e.target.files); e.target.value = ""; }} /></Field>
        <div className="admin__thumb">
          {logo && <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={logo.src} alt="" style={{ height: 48, width: "auto", maxWidth: 220, objectFit: "contain" }} /><button type="button" className="btn btn--secondary btn--sm" onClick={() => setLogo(null)}>Remove logo</button></>}
        </div>
        <Field id={id("logo")} label="Product logo (any shape; a transparent PNG looks best)"><input id={id("logo")} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => { setLogoFile(e.target.files); e.target.value = ""; }} /></Field>
        {uploading && <p className="hint" role="status">{uploading}</p>}
      </fieldset>

      <fieldset className="admin__group">
        <legend>Technical details (optional)</legend>
        <div className="admin__cols">
          <Field id={id("req")} label="Requirements (one per line)"><textarea id={id("req")} rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} /></Field>
          <Field id={id("plat")} label="Supported platforms (one per line)"><textarea id={id("plat")} rows={3} value={platforms} onChange={(e) => setPlatforms(e.target.value)} /></Field>
          <Field id={id("dep")} label="Deployment options (one per line)"><textarea id={id("dep")} rows={3} value={deployment} onChange={(e) => setDeployment(e.target.value)} /></Field>
        </div>
        <Field id={id("inst")} label="Installation steps (one per line)"><textarea id={id("inst")} rows={4} value={installation} onChange={(e) => setInstallation(e.target.value)} /></Field>
        <Field id={id("ver")} label="Version"><input id={id("ver")} type="text" value={version} maxLength={40} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" /></Field>
      </fieldset>

      <fieldset className="admin__group">
        <legend>Pricing, licensing and policies (optional)</legend>
        <p className="hint" style={{ marginTop: 0 }}>Leave the price blank until it is confirmed — the page will say “Contact us”.</p>
        <div className="admin__cols">
          <Field id={id("price")} label="Price (shown exactly as typed)"><input id={id("price")} type="text" value={pricingDisplay} maxLength={80} onChange={(e) => setPricingDisplay(e.target.value)} placeholder="From $29/month" /></Field>
          <Field id={id("pnote")} label="Price note" hint="Shown under the price. With no price entered, visitors see “Contact us for pricing” followed by this note."><input id={id("pnote")} type="text" value={pricingNote} maxLength={200} onChange={(e) => setPricingNote(e.target.value)} /></Field>
        </div>
        <Field id={id("lic")} label="Licensing"><textarea id={id("lic")} rows={2} value={licensing} onChange={(e) => setLicensing(e.target.value)} /></Field>
        <Field id={id("upd")} label="Updates and maintenance"><textarea id={id("upd")} rows={2} value={updatePolicy} onChange={(e) => setUpdatePolicy(e.target.value)} /></Field>
        <Field id={id("sup")} label="Support note"><textarea id={id("sup")} rows={2} value={supportNote} onChange={(e) => setSupportNote(e.target.value)} /></Field>
      </fieldset>

      <Rows title="Documentation links (optional)" hint="These appear on the product page and on the Resources page. Choose where each one is listed, or leave Automatic." rows={documentation} setRows={setDocumentation} addLabel="Add documentation link"
        cols={[
          { key: "label", label: "Label", placeholder: "User guide" },
          { key: "category", label: "Shown under", options: [{ value: "", label: "Automatic (from the label)" }, ...resourceCategories.map((c) => ({ value: c.id, label: c.title }))] },
          { key: "href", label: "Link", placeholder: "https://…", wide: true },
        ]} />

      <fieldset className="admin__group">
        <legend>Sell on the Bridgecodes checkout page (optional)</legend>
        <p className="hint" style={{ marginTop: 0 }}>
          Your website has a checkout page for this product at <code>/products/{slug || "your-product"}/checkout</code>. Buyers review the order, accept the terms,
          then pay on your payment provider&apos;s secure page, so no card details touch this website. To enable it, create a <strong>payment link</strong> for
          this product in Stripe, Paystack, Flutterwave or a similar provider and paste it here. Only works while the status is <strong>Available</strong>.
        </p>
        <div className="admin__cols">
          <Field id={id("payhref")} label="Payment link" hint="Must start with https://">
            <input id={id("payhref")} type="text" value={paymentHref} maxLength={500} onChange={(e) => setPaymentHref(e.target.value)} placeholder="https://buy.stripe.com/…" />
          </Field>
          <Field id={id("payprov")} label="Provider name (shown to buyers)">
            <input id={id("payprov")} type="text" value={paymentProvider} maxLength={40} onChange={(e) => setPaymentProvider(e.target.value)} placeholder="Stripe" />
          </Field>
        </div>
      </fieldset>

      <Rows title="Other places to buy (optional)" hint="For example a marketplace listing. Add a link ONLY when the listing is live. If there is no checkout and no link, visitors see an enquiry button instead."
        rows={purchaseLinks} setRows={setPurchaseLinks} addLabel="Add purchase link"
        cols={[{ key: "label", label: "Button text", placeholder: "Buy on Envato" }, { key: "channel", label: "Sold on", placeholder: "Envato Market" }, { key: "href", label: "Link", placeholder: "https://…", wide: true }]} />

      <fieldset className="admin__group">
        <legend>Live demo (optional)</legend>
        <p className="hint" style={{ marginTop: 0 }}>Link to the real, working demo or trial of this product. Visitors get a button that opens it. Leave blank if there is no demo yet.</p>
        <div className="admin__cols">
          <Field id={id("tl")} label="Button text"><input id={id("tl")} type="text" value={trialLabel} onChange={(e) => setTrialLabel(e.target.value)} placeholder="View live demo" /></Field>
          <Field id={id("th")} label="Demo link" hint="Must start with https://"><input id={id("th")} type="text" value={trialHref} onChange={(e) => setTrialHref(e.target.value)} placeholder="https://demo.example.com" /></Field>
        </div>
      </fieldset>

      <div className="btn-row">
        <button className="btn btn--primary" type="submit" disabled={busy || Boolean(uploading)}>{busy ? "Saving…" : editing ? "Save changes" : "Create product"}</button>
        <button className="btn btn--secondary" type="button" onClick={() => router.push("/admin")}>Cancel</button>
      </div>
    </form>
  );
}
