import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { MAX_IMAGE_BYTES, saveImage, sniffImageType } from "@/lib/media";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const fail = (status: number, message: string) => NextResponse.json({ ok: false, message }, { status, headers: noStore });

export async function POST(req: NextRequest) {
  const denied = guardAdminApi(req);
  if (denied) return denied;
  if (!getStore()) return fail(503, "No storage is connected.");

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail(400, "Choose an image file.");
  if (file.size > MAX_IMAGE_BYTES) return fail(413, "Image is too large (max 700 KB after automatic compression).");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImageType(bytes); // trust file contents, not the filename or declared type
  if (!type) return fail(415, "Only PNG, JPEG, WebP or GIF images are allowed.");

  try {
    const id = await saveImage(bytes, type);
    return NextResponse.json({ ok: true, src: `/media/${id}` }, { headers: noStore });
  } catch {
    return fail(502, "Could not store the image.");
  }
}
