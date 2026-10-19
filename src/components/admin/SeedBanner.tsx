"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedBanner({ names }: { names: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"" | "import" | "dismiss">("");
  const [error, setError] = useState("");

  async function run(action: "import" | "dismiss") {
    setBusy(action); setError("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message ?? "Could not save.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      setBusy("");
    }
  }

  return (
    <section className="note" aria-labelledby="seed-title" style={{ marginBottom: 24 }}>
      <h2 id="seed-title" style={{ fontSize: "1.1rem" }}>{names.length} starter drafts are ready to import</h2>
      <p>
        These were written from your own projects&apos; READMEs and code: <strong>{names.join(", ")}</strong>. They are added as
        <strong> hidden drafts</strong> with no prices, logos, screenshots or purchase links, and nothing appears on the website until you publish each one.
        Review every description and status first.
      </p>
      {error && <p className="field__error" role="alert">{error}</p>}
      <div className="btn-row">
        <button type="button" className="btn btn--primary btn--sm" onClick={() => run("import")} disabled={busy !== ""}>
          {busy === "import" ? "Importing…" : `Import ${names.length} drafts`}
        </button>
        <button type="button" className="btn btn--secondary btn--sm" onClick={() => run("dismiss")} disabled={busy !== ""}>
          {busy === "dismiss" ? "Saving…" : "No thanks"}
        </button>
      </div>
    </section>
  );
}
