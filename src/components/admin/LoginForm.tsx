"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const password = new FormData(e.currentTarget).get("password");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { router.push("/admin"); router.refresh(); return; }
      setError(data.message ?? "Could not sign in.");
    } catch { setError("Network error. Try again."); }
    setBusy(false);
  }

  return (
    <form className="form" onSubmit={onSubmit} style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1 style={{ fontSize: "1.6rem" }}>Admin sign in</h1>
      {error && <div className="notice notice--error" role="alert">{error}</div>}
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
