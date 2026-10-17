import { NextResponse } from "next/server";
import { issueToken, turnstileEnabled } from "@/lib/spam";

export const dynamic = "force-dynamic";

/** Issues a short-lived signed token that the form must send back with its submission. */
export function GET() {
  return NextResponse.json(
    { token: issueToken(), turnstile: turnstileEnabled() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
