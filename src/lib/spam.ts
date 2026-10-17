import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Spam protection layers:
 *  1. Signed, time-stamped form token (bots posting without loading the page fail).
 *  2. Minimum fill time + maximum token age.
 *  3. Honeypot field (checked in the route).
 *  4. Per-IP rate limiting (in-memory; per server instance).
 *  5. Optional Cloudflare Turnstile.
 */

const MIN_AGE_MS = 2_500;
const MAX_AGE_MS = 4 * 60 * 60 * 1000;

let ephemeralSecret: string | undefined;
function secret(): string {
  const s = process.env.FORM_TOKEN_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "production") {
    // Still functional, but tokens won't survive restarts / multiple instances.
    console.warn("[forms] FORM_TOKEN_SECRET is not set; using a per-process secret.");
  }
  return (ephemeralSecret ??= randomBytes(32).toString("hex"));
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

export function issueToken(now = Date.now()): string {
  const nonce = randomBytes(8).toString("hex");
  const payload = `${now}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function checkToken(token: unknown, now = Date.now()): "ok" | "invalid" | "too-fast" | "expired" {
  if (typeof token !== "string") return "invalid";
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const [ts, nonce, sig] = parts;
  const expected = sign(`${ts}.${nonce}`);
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "invalid";
  const age = now - Number(ts);
  if (!Number.isFinite(age) || age < 0) return "invalid";
  if (age < MIN_AGE_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

// ── Rate limiting (sliding window, in-memory) ───────────────────────
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 8, windowMs = 10 * 60 * 1000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}

// ── Optional Cloudflare Turnstile ───────────────────────────────────
export const turnstileEnabled = () => Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secretKey) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
