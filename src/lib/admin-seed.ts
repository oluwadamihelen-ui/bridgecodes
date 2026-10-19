import { getAllProducts, saveProducts } from "./catalogue";
import { getStore } from "./store";
import { refreshSite } from "./admin-products";
import { seedProducts } from "@/content/seed-products";
import type { Product } from "@/content/products";

const FLAG = "bc:seeds-handled";
const FILL_FLAG = "bc:seed-policies-handled";
const POLICY_FIELDS = ["licensing", "updatePolicy", "supportNote"] as const;

/** Starter drafts not yet in the product list. Empty once imported or dismissed, or when there is no storage. */
export async function pendingSeeds(): Promise<Product[]> {
  const store = getStore();
  if (!store) return [];
  try {
    if (await store.get(FLAG)) return [];
  } catch {
    return [];
  }
  const have = new Set((await getAllProducts()).map((p) => p.slug));
  return seedProducts.filter((p) => !have.has(p.slug));
}

/** Adds the missing starter products as hidden drafts (never overwriting an existing slug), or just dismisses the offer. */
export async function handleSeeds(action: "import" | "dismiss"): Promise<number> {
  const store = getStore();
  if (!store) throw new Error("NO_STORAGE");
  let added = 0;
  if (action === "import") {
    const list = await getAllProducts();
    const have = new Set(list.map((p) => p.slug));
    const missing = seedProducts.filter((p) => !have.has(p.slug)).map((p) => ({ ...p, published: false }));
    added = missing.length;
    if (added) await saveProducts([...list, ...missing]);
  }
  await store.set(FLAG, new Date().toISOString());
  if (added) refreshSite();
  return added;
}

/** Products already in the store (from a starter draft) whose licensing, update or support text is still empty. */
export async function pendingFills(): Promise<Product[]> {
  const store = getStore();
  if (!store) return [];
  try {
    if (await store.get(FILL_FLAG)) return [];
  } catch {
    return [];
  }
  const list = await getAllProducts();
  return list.filter((p) => {
    const seed = seedProducts.find((s) => s.slug === p.slug);
    return seed && POLICY_FIELDS.some((f) => !p[f] && seed[f]);
  });
}

/** Fills ONLY empty licensing/update/support fields on starter drafts; anything already typed is kept. */
export async function fillPolicies(action: "fill" | "dismiss-fill"): Promise<number> {
  const store = getStore();
  if (!store) throw new Error("NO_STORAGE");
  let changed = 0;
  if (action === "fill") {
    const list = await getAllProducts();
    const next = list.map((p) => {
      const seed = seedProducts.find((s) => s.slug === p.slug);
      if (!seed) return p;
      const patch: Partial<Product> = {};
      for (const f of POLICY_FIELDS) if (!p[f] && seed[f]) patch[f] = seed[f];
      if (!Object.keys(patch).length) return p;
      changed++;
      return { ...p, ...patch };
    });
    if (changed) await saveProducts(next);
  }
  await store.set(FILL_FLAG, new Date().toISOString());
  if (changed) refreshSite();
  return changed;
}
