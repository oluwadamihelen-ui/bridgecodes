import { revalidatePath } from "next/cache";
import { getAllProducts, saveProducts } from "./catalogue";
import { deleteImage, imageIds } from "./media";
import type { Product } from "@/content/products";

/** Marks every public page (and the sitemap) stale so the change shows on the next visit. */
export const refreshSite = () => revalidatePath("/", "layout");

export async function upsertProduct(product: Product, mode: "create" | "update"): Promise<"ok" | "exists" | "missing"> {
  const list = await getAllProducts();
  const i = list.findIndex((p) => p.slug === product.slug);
  if (mode === "create" && i >= 0) return "exists";
  if (mode === "update" && i < 0) return "missing";
  const before = i >= 0 ? list[i] : undefined;
  const next = i >= 0 ? list.map((p, j) => (j === i ? product : p)) : [...list, product];
  await saveProducts(next);
  // Remove images that are no longer referenced.
  if (before) {
    const keep = new Set(imageIds(product));
    await Promise.all(imageIds(before).filter((id) => !keep.has(id)).map(deleteImage));
  }
  refreshSite();
  return "ok";
}

export async function removeProduct(slug: string): Promise<boolean> {
  const list = await getAllProducts();
  const target = list.find((p) => p.slug === slug);
  if (!target) return false;
  await saveProducts(list.filter((p) => p.slug !== slug));
  await Promise.all(imageIds(target).map(deleteImage));
  refreshSite();
  return true;
}
