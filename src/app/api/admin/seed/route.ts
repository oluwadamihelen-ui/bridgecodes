import { NextResponse, type NextRequest } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { fillPolicies, handleSeeds } from "@/lib/admin-seed";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  const denied = guardAdminApi(req);
  if (denied) return denied;
  if (!getStore()) return NextResponse.json({ ok: false, message: "No storage is connected." }, { status: 503, headers: noStore });
  const body = (await req.json().catch(() => ({}))) as { action?: unknown };
  const action = body.action;
  if (action !== "import" && action !== "dismiss" && action !== "fill" && action !== "dismiss-fill") {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400, headers: noStore });
  }
  try {
    const added = action === "fill" || action === "dismiss-fill" ? await fillPolicies(action) : await handleSeeds(action);
    return NextResponse.json({ ok: true, added }, { headers: noStore });
  } catch (err) {
    console.error("[admin] seed failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not save. Check the storage connection." }, { status: 502, headers: noStore });
  }
}
