import { NextResponse, type NextRequest } from "next/server";
import { validateEnquiry } from "@/lib/validate";
import { checkToken, rateLimited, verifyTurnstile } from "@/lib/spam";
import { deliverEnquiry } from "@/lib/delivery";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24 * 1024;
const noStore = { "Cache-Control": "no-store" };
const fail = (status: number, message: string, errors?: unknown) =>
  NextResponse.json({ ok: false, message, errors }, { status, headers: noStore });

function clientIp(req: NextRequest): string {
  // Behind a trusted proxy/CDN the first x-forwarded-for entry is the client.
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // Same-origin check (CSRF hardening for a JSON endpoint).
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return fail(403, "Request not allowed.");

  if (!(req.headers.get("content-type") ?? "").includes("application/json")) {
    return fail(415, "Unsupported content type.");
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return fail(413, "Your message is too large.");

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return fail(413, "Your message is too large.");

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(400, "Invalid request.");
  }
  if (typeof body !== "object" || body === null) return fail(400, "Invalid request.");

  const ip = clientIp(req);
  if (rateLimited(ip)) return fail(429, "Too many submissions. Please wait a few minutes and try again.");

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { headers: noStore });
  }

  const tokenState = checkToken(body.token);
  if (tokenState === "too-fast") return fail(400, "That was very quick. Please review your message and submit again.");
  if (tokenState !== "ok") return fail(400, "Your session expired. Please reload the page and try again.");

  if (!(await verifyTurnstile(body.turnstile, ip))) {
    return fail(400, "Spam check failed. Please try again.");
  }

  const result = validateEnquiry(body);
  if (!result.ok) return fail(422, "Please correct the highlighted fields.", result.errors);

  try {
    const ref = await deliverEnquiry(result.data);
    return NextResponse.json({ ok: true, reference: ref }, { headers: noStore });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_CONFIGURED") {
      console.error("[forms] No delivery channel configured (see .env.example). Submission was NOT stored.");
      return fail(503, "This form is temporarily unavailable. Please try again later.");
    }
    console.error("[forms] delivery failed");
    return fail(502, "We could not send your message. Please try again shortly.");
  }
}
