import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, adminEnabled, newSessionToken, passwordMatches, sessionCookieOptions } from "@/lib/admin-auth";
import { rateLimited } from "@/lib/spam";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  if (!adminEnabled()) return NextResponse.json({ ok: false, message: "Not found." }, { status: 404, headers: noStore });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false, message: "Request not allowed." }, { status: 403, headers: noStore });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(`admin-login:${ip}`, 6, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: "Too many attempts. Try again in 15 minutes." }, { status: 429, headers: noStore });
  }

  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (!passwordMatches(body.password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ ok: false, message: "Incorrect password." }, { status: 401, headers: noStore });
  }
  const res = NextResponse.json({ ok: true }, { headers: noStore });
  res.cookies.set(COOKIE, newSessionToken(), sessionCookieOptions);
  return res;
}
