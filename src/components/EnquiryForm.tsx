"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formSpecs, type EnquiryKind, type FieldName } from "@/lib/enquiry-schema";

type Errors = Partial<Record<FieldName, string>>;
type State =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "success"; reference?: string }
  | { phase: "error"; message: string };

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

export function EnquiryForm({
  kind,
  turnstileSiteKey,
}: {
  kind: EnquiryKind;
  turnstileSiteKey?: string | null;
}) {
  const spec = formSpecs[kind];
  const uid = useId();
  const [token, setToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ phase: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);

  // Fetch a short-lived signed token (anti-spam) when the form mounts.
  useEffect(() => {
    let live = true;
    fetch("/api/enquiries/token", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => live && setToken(d.token))
      .catch(() => live && setState({ phase: "error", message: "The form could not be prepared. Please reload the page." }));
    return () => { live = false; };
  }, []);

  // Optional Cloudflare Turnstile widget.
  useEffect(() => {
    if (!turnstileSiteKey || !tsRef.current) return;
    const el = tsRef.current;
    const mount = () => window.turnstile?.render(el, { sitekey: turnstileSiteKey, callback: setTurnstileToken });
    if (window.turnstile) { mount(); return; }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = mount;
    document.head.appendChild(s);
  }, [turnstileSiteKey]);

  useEffect(() => {
    // Field errors move focus to the first invalid field instead (see onSubmit).
    if (state.phase === "success" || (state.phase === "error" && Object.keys(errors).length === 0)) statusRef.current?.focus();
  }, [state, errors]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.phase === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = { kind, token, turnstile: turnstileSiteKey ? turnstileToken : "" };
    for (const [k, v] of fd.entries()) if (typeof v === "string") payload[k] = v;

    setErrors({});
    setState({ phase: "sending" });
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        formRef.current?.reset();
        setState({ phase: "success", reference: data.reference });
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        const first = spec.fields.find((f) => data.errors[f.name]);
        if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      }
      // Tokens are reusable until they expire; only replace one the server rejected.
      if (res.status === 400) {
        fetch("/api/enquiries/token", { cache: "no-store" }).then((r) => r.json()).then((d) => setToken(d.token)).catch(() => {});
      }
      window.turnstile?.reset();
      setState({ phase: "error", message: data.message ?? "Something went wrong. Please try again." });
    } catch {
      setState({ phase: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (state.phase === "success") {
    return (
      <div className="notice notice--success" role="status" tabIndex={-1} ref={statusRef}>
        <h3>Thank you — your message has been sent.</h3>
        <p>We have received your {kind === "contact" ? "enquiry" : kind === "bug" ? "bug report" : "support request"} and will reply by email.</p>
        {state.reference && <p className="muted">Reference: <code>{state.reference}</code></p>}
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => setState({ phase: "idle" })}>Send another</button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="form" aria-labelledby={`${uid}-title`}>
      <h3 id={`${uid}-title`}>{spec.title}</h3>

      {state.phase === "error" && (
        <div className="notice notice--error" role="alert" tabIndex={-1} ref={statusRef}>{state.message}</div>
      )}

      {spec.fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const err = errors[f.name];
        const describedBy = [f.hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
        const common = {
          id,
          name: f.name,
          required: f.required,
          "aria-required": f.required || undefined,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": describedBy,
          maxLength: f.max,
          autoComplete: f.autoComplete,
        };
        return (
          <div className={`field${err ? " field--error" : ""}`} key={f.name}>
            <label htmlFor={id}>{f.label}{f.required && <span aria-hidden="true" className="req"> *</span>}</label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={f.rows ?? 6} />
            ) : f.type === "select" ? (
              <select {...common} defaultValue="">
                <option value="" disabled>Select…</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input {...common} type={f.type} />
            )}
            {f.hint && <p className="hint" id={`${id}-hint`}>{f.hint}</p>}
            {err && <p className="field__error" id={`${id}-err`}>{err}</p>}
          </div>
        );
      })}

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && <div ref={tsRef} />}

      <p className="hint">
        We use the details you provide only to respond to your request. See our <a href="/privacy-policy">Privacy Policy</a>.
      </p>
      <button type="submit" className="btn btn--primary" disabled={state.phase === "sending" || !token}>
        {state.phase === "sending" ? "Sending…" : spec.submitLabel}
      </button>
    </form>
  );
}
