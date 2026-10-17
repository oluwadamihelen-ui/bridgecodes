"use client";

import { useEffect, useState } from "react";

const KEY = "bc-analytics-consent";
type Choice = "granted" | "denied" | null;

const read = (): Choice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};

/**
 * Optional privacy-friendly analytics (Plausible, cookieless).
 * Rendered only when PLAUSIBLE_DOMAIN is configured. If consent is required,
 * the script loads only after the visitor opts in, and the choice is honoured.
 */
export function Analytics({ domain, src, requiresConsent }: { domain: string; src: string; requiresConsent: boolean }) {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (requiresConsent && choice !== "granted") return;
    const s = document.createElement("script");
    s.defer = true;
    s.src = src;
    s.dataset.domain = domain;
    document.head.appendChild(s);
    return () => s.remove();
  }, [ready, choice, requiresConsent, domain, src]);

  const decide = (c: "granted" | "denied") => {
    try { localStorage.setItem(KEY, c); } catch { /* storage unavailable: choice applies to this visit only */ }
    setChoice(c);
  };

  if (!requiresConsent || !ready || choice !== null) return null;

  return (
    <div className="consent" role="dialog" aria-labelledby="consent-title" aria-describedby="consent-desc">
      <div>
        <p id="consent-title"><strong>Analytics preferences</strong></p>
        <p id="consent-desc">
          We would like to use privacy-friendly analytics to understand how the site is used. See our{" "}
          <a href="/cookies">Cookie Policy</a>.
        </p>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => decide("denied")}>Decline</button>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => decide("granted")}>Accept</button>
      </div>
    </div>
  );
}
