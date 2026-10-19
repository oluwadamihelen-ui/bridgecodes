"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedBanner({ names, mode = "import" }: { names: string[]; mode?: "import" | "fill" }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"" | "import" | "dismiss" | "fill" | "dismiss-fill">("");
  const [error, setError] = useState("");

  async function run(action: "import" | "dismiss" | "fill" | "dismiss-fill") {
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

  if (mode === "fill") {
    return (
      <section className="note" aria-labelledby="fill-title" style={{ marginBottom: 24 }}>
        <h2 id="fill-title" style={{ fontSize: "1.1rem" }}>Add licensing, update, support and price-note wording to {names.length} {names.length === 1 ? "draft" : "drafts"}</h2>
        <p>
          <strong>{names.join(", ")}</strong> {names.length === 1 ? "has" : "have"} empty Licensing, Updates and maintenance, Support note or Price note fields. This fills <strong>only the empty ones</strong> with
          careful, non-committal wording (nothing you have typed is changed, and no prices are added). Review and edit each product afterwards.
        </p>
        {error && <p className="field__error" role="alert">{error}</p>}
        <div className="btn-row">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => run("fill")} disabled={busy !== ""}>{busy === "fill" ? "Filling…" : "Fill empty fields"}</button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => run("dismiss-fill")} disabled={busy !== ""}>{busy === "dismiss-fill" ? "Saving…" : "No thanks"}</button>
        </div>
      </section>
    );
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
