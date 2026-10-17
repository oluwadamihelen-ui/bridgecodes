import { codeProducts, type Product } from "@/content/products";
import { getStore } from "./store";

export const PRODUCTS_KEY = "bc:products";
const showUnpublished = () => process.env.PREVIEW_UNPUBLISHED_PRODUCTS === "true" && process.env.NODE_ENV !== "production";

/** Every product including drafts. Admin-saved data wins; otherwise the list defined in code. */
export async function getAllProducts(): Promise<Product[]> {
  const store = getStore();
  if (store) {
    try {
      const raw = await store.get(PRODUCTS_KEY);
      if (raw) return JSON.parse(raw) as Product[];
    } catch (err) {
      console.error("[catalogue] could not read stored products; using built-in list:", err instanceof Error ? err.message : err);
    }
  }
  return codeProducts;
}

/** Products visible on the public site. */
export async function getProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.published || showUnpublished());
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function saveProducts(list: Product[]): Promise<void> {
  const store = getStore();
  if (!store) throw new Error("NO_STORAGE");
  await store.set(PRODUCTS_KEY, JSON.stringify(list));
}
