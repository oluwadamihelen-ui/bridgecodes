import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { validateProduct } from "@/lib/product-validate";
import { removeProduct, upsertProduct } from "@/lib/admin-products";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const denied = guardAdminApi(req);
  if (denied) return denied;
  if (!getStore()) return NextResponse.json({ ok: false, message: "No storage is connected." }, { status: 503, headers: noStore });
  const { slug } = await params;

  const result = validateProduct(await req.json().catch(() => null), { slug }); // slug is fixed after creation
  if (!result.ok) return NextResponse.json({ ok: false, message: "Please fix the following.", errors: result.errors }, { status: 422, headers: noStore });
  try {
    const outcome = await upsertProduct(result.product, "update");
    if (outcome === "missing") return NextResponse.json({ ok: false, message: "Product not found." }, { status: 404, headers: noStore });
    return NextResponse.json({ ok: true, slug }, { headers: noStore });
  } catch (err) {
    console.error("[admin] save failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not save. Check the storage connection." }, { status: 502, headers: noStore });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const denied = guardAdminApi(req);
  if (denied) return denied;
  if (!getStore()) return NextResponse.json({ ok: false, message: "No storage is connected." }, { status: 503, headers: noStore });
  try {
    const removed = await removeProduct((await params).slug);
    return NextResponse.json(removed ? { ok: true } : { ok: false, message: "Product not found." }, { status: removed ? 200 : 404, headers: noStore });
  } catch (err) {
    console.error("[admin] delete failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not delete. Check the storage connection." }, { status: 502, headers: noStore });
  }
}
