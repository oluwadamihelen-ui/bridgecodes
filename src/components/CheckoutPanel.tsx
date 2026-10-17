"use client";

import Link from "next/link";
import { useId, useState } from "react";

/** Terms agreement, then hand-off to the provider's hosted payment page. No card data is handled here. */
export function CheckoutPanel({ href, provider }: { href: string; provider?: string }) {
  const id = useId();
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="form">
      <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Secure payment</h2>
      <p style={{ margin: 0 }}>
        You will pay on a secure page hosted by {provider ? <strong>{provider}</strong> : "our payment provider"}. Bridgecodes does not see or store your card details.
      </p>
      <label className="admin__check" htmlFor={id}>
        <input id={id} type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>
          I have read and agree to the <Link href="/terms-of-service" target="_blank">Terms of Service</Link>,{" "}
          <Link href="/license-agreement" target="_blank">License Agreement</Link> and{" "}
          <Link href="/refund-policy" target="_blank">Refund Policy</Link>.
        </span>
      </label>
      {agreed ? (
        <a className="btn btn--primary" href={href} rel="noopener noreferrer">Continue to secure payment</a>
      ) : (
        <button className="btn btn--primary" type="button" disabled aria-describedby={id}>Continue to secure payment</button>
      )}
      <p className="hint" style={{ margin: 0 }}>
        Questions before you buy? <Link href="/support">Contact support</Link>. After payment, use the confirmation you receive for any support or licence questions.
      </p>
    </div>
  );
}
