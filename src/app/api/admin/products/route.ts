import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { validateProduct } from "@/lib/product-validate";
import { upsertProduct } from "@/lib/admin-products";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  const denied = guardAdminApi(req);
  if (denied) return denied;
  if (!getStore()) return NextResponse.json({ ok: false, message: "No storage is connected yet. See the setup notice on the admin dashboard." }, { status: 503, headers: noStore });

  const body = await req.json().catch(() => null);
  const result = validateProduct(body);
  if (!result.ok) return NextResponse.json({ ok: false, message: "Please fix the following.", errors: result.errors }, { status: 422, headers: noStore });

  try {
    const outcome = await upsertProduct(result.product, "create");
    if (outcome === "exists") return NextResponse.json({ ok: false, message: "A product with that web address already exists.", errors: ["Web address (slug) is already in use."] }, { status: 409, headers: noStore });
    return NextResponse.json({ ok: true, slug: result.product.slug }, { headers: noStore });
  } catch (err) {
    console.error("[admin] save failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not save. Check the storage connection." }, { status: 502, headers: noStore });
  }
}
