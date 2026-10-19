import { getAllProducts, saveProducts } from "./catalogue";
import { getStore } from "./store";
import { refreshSite } from "./admin-products";
import { seedProducts } from "@/content/seed-products";
import type { Product } from "@/content/products";

const FLAG = "bc:seeds-handled";

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
