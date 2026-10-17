import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/**
 * Single-owner admin authentication.
 *  - Enabled only when ADMIN_PASSWORD (12+ chars) is set; otherwise /admin returns 404.
 *  - Login issues an HMAC-signed, expiring, HttpOnly, SameSite=Strict cookie (no server session store).
 *  - Mutating API calls also require a same-origin request.
 */
const password = () => {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length >= 12 ? p : null;
};

export const adminEnabled = () => password() !== null;
export const COOKIE = process.env.NODE_ENV === "production" ? "__Host-bc_admin" : "bc_admin";
const MAX_AGE_S = 8 * 60 * 60;

const secret = () => process.env.ADMIN_SESSION_SECRET?.trim() || `bc-admin-session:${password() ?? ""}`;
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");
const sha = (s: string) => createHash("sha256").update(s).digest();

export function passwordMatches(input: unknown): boolean {
  const p = password();
  return p !== null && typeof input === "string" && timingSafeEqual(sha(input), sha(p));
}

export function newSessionToken(now = Date.now()): string {
  const exp = String(now + MAX_AGE_S * 1000);
  return `${exp}.${sign(exp)}`;
}

export function sessionValid(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminEnabled()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = Buffer.from(sign(exp), "hex");
  const got = Buffer.from(sig, "hex");
  return got.length === expected.length && timingSafeEqual(got, expected) && Number(exp) > now;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE_S,
};

/** For server components/pages. */
export async function isAdmin(): Promise<boolean> {
  return sessionValid((await cookies()).get(COOKIE)?.value);
}

/** For API routes: returns an error Response when the caller must not proceed, else null. */
export function guardAdminApi(req: NextRequest): Response | null {
  const deny = (status: number, message: string) => Response.json({ ok: false, message }, { status, headers: { "Cache-Control": "no-store" } });
  if (!adminEnabled()) return deny(404, "Not found.");
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return deny(403, "Request not allowed.");
  if (!sessionValid(req.cookies.get(COOKIE)?.value)) return deny(401, "Please sign in again.");
  return null;
}
