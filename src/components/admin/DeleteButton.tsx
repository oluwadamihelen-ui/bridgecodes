"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn--secondary btn--sm btn--danger"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(`Delete “${name}”? This removes it from the website and cannot be undone.`)) return;
        setBusy(true);
        const res = await fetch(`/api/admin/products/${encodeURIComponent(slug)}`, { method: "DELETE" });
        if (!res.ok) { setBusy(false); window.alert((await res.json().catch(() => ({}))).message ?? "Could not delete."); return; }
        router.refresh();
      }}
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
