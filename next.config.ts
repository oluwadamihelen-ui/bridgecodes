import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const analyticsSrc = process.env.PLAUSIBLE_DOMAIN?.trim()
  ? new URL(process.env.PLAUSIBLE_SCRIPT_SRC?.trim() || "https://plausible.io/js/script.js").origin
  : "";
const turnstile = process.env.TURNSTILE_SITE_KEY?.trim() ? "https://challenges.cloudflare.com" : "";

// Next.js emits small inline bootstrap scripts, so 'unsafe-inline' is needed for script-src
// unless nonces are used (which would make every page dynamic). Everything else is locked down.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${analyticsSrc} ${turnstile}`.trim(),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${analyticsSrc}${isDev ? " ws: wss:" : ""}`.trim(),
  `frame-src ${turnstile || "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default config;
