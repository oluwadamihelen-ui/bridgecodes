import { randomBytes } from "node:crypto";
import { getStore } from "./store";

/** Admin-uploaded images, stored in the same key/value store as products and served from /media/<id>. */
export const MAX_IMAGE_BYTES = 700 * 1024;
const ID_RE = /^[a-f0-9]{24}$/;

export function sniffImageType(b: Uint8Array): "image/png" | "image/jpeg" | "image/webp" | "image/gif" | null {
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 12 && String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") return "image/webp";
  if (b.length > 6 && String.fromCharCode(...b.slice(0, 4)) === "GIF8") return "image/gif";
  return null;
}

export async function saveImage(bytes: Uint8Array, type: string): Promise<string> {
  const store = getStore();
  if (!store) throw new Error("NO_STORAGE");
  const id = randomBytes(12).toString("hex");
  await store.set(`bc:img:${id}`, JSON.stringify({ t: type, d: Buffer.from(bytes).toString("base64") }));
  return id;
}

export async function loadImage(id: string): Promise<{ type: string; data: Buffer } | null> {
  if (!ID_RE.test(id)) return null;
  const raw = await getStore()?.get(`bc:img:${id}`);
  if (!raw) return null;
  const { t, d } = JSON.parse(raw) as { t: string; d: string };
  return { type: t, data: Buffer.from(d, "base64") };
}

export async function deleteImage(id: string): Promise<void> {
  if (ID_RE.test(id)) await getStore()?.del(`bc:img:${id}`);
}

/** Image ids (uploaded via the admin) referenced by a product. */
export function imageIds(p: { screenshots?: { src: string }[]; logo?: { src: string } }): string[] {
  return [...(p.screenshots?.map((s) => s.src) ?? []), ...(p.logo ? [p.logo.src] : [])]
    .map((s) => s.match(/^\/media\/([a-f0-9]{24})$/)?.[1])
    .filter((x): x is string => Boolean(x));
}
