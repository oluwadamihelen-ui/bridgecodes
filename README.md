# Bridgecodes website

Official corporate website of **Bridgecodes**, a software development and digital products brand owned by **Numi Innovations Ltd.**

Stack: Next.js 16 (App Router, static-first) · React 19 · TypeScript · plain CSS design tokens · self-hosted Inter font. Only 3 runtime dependencies besides React/Next (`@fontsource-variable/inter`). Forms use a server route and email via Resend's REST API (no SDK).

## Local development

```bash
npm install
cp .env.example .env.local     # fill in what you have; blank values are simply not shown
npm run dev                    # http://localhost:3000
npm run typecheck
npm run build && npm start     # production build
npm run check:links            # with the production server running: crawls all internal links/anchors
```

To test forms locally without an email provider, set `ENQUIRY_STORE_DIR=./data`; submissions are appended to `data/enquiries.jsonl` (git-ignored).
To preview the product layouts with the unpublished template product: `PREVIEW_UNPUBLISHED_PRODUCTS=true npm run dev` (never active in production).

## Where to edit things (no component changes needed)

| What | File |
|---|---|
| Company identity, contact, socials, legal settings | env vars → `src/config/site.ts` |
| Products, prices, purchase links, screenshots, docs | `src/content/products.ts` (screenshots in `public/products/<slug>/`) |
| Services / solutions | `src/content/services.ts`, `src/content/solutions.ts` |
| FAQs | `src/content/faqs.ts` |
| Documentation & resources | `src/content/resources.ts` (only add what exists) |
| Legal pages | `src/content/legal.ts` |

Nothing is invented: any value not configured is hidden, and unresolved legal details show as highlighted `TO CONFIRM` markers. The site ships with **no published products** until real ones are added.

## Environment variables

See `.env.example` for the full annotated list. Values are read at **build time** for static pages, so set them before `npm run build`.

- **Identity/contact:** `SITE_URL`, `CONTACT_EMAIL`, `SUPPORT_EMAIL`, `CONTACT_PHONE`, `REGISTERED_ADDRESS`, `COMPANY_REGISTRATION_NUMBER`, `SOCIAL_*`
- **Legal:** `LEGAL_EFFECTIVE_DATE`, `LEGAL_GOVERNING_JURISDICTION`, `LEGAL_PRIVACY_CONTACT_EMAIL`, `LEGAL_REFUND_WINDOW_DAYS`, `LEGAL_REVIEWED`
- **Form delivery (at least one required):** `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` + `ENQUIRY_TO_EMAIL` (+ optional `SUPPORT_TO_EMAIL`), and/or `ENQUIRY_STORE_DIR`
- **Spam:** `FORM_TOKEN_SECRET` (required in production; `openssl rand -hex 32`), optional `TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY`
- **Analytics (optional):** `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_SCRIPT_SRC`, `ANALYTICS_REQUIRES_CONSENT`

Secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `FORM_TOKEN_SECRET`) are only read in server code and never sent to the browser.

## How forms work

`/contact` (contact), `/support` (support request) and `/support#bug-report` (bug) post to `POST /api/enquiries`, which: checks same-origin and size, rate-limits per IP, verifies a signed time-stamped token plus a honeypot (and Turnstile if configured), validates every field server-side, then delivers by email and/or JSONL file. Each kind is labelled separately. If **no** delivery channel is configured the API returns an error (503) rather than pretending to succeed.
The in-memory rate limiter is per server instance; add an edge/WAF limit if you scale horizontally.

## Deployment

1. Set the environment variables in your host (Vercel, Netlify, a Node server, or Docker).
2. `npm run build` then `npm start` (Node 20+). On Vercel/Netlify just connect the repo.
3. Serverless hosts have no persistent disk: use Resend (not `ENQUIRY_STORE_DIR`).
4. Serve over HTTPS; security headers (CSP, HSTS, etc.) are set in `next.config.ts`.
5. Until `SITE_URL` is set, production builds send `noindex` and `robots.txt` disallows everything. Setting it enables indexing, canonical URLs and the sitemap.

## Pre-launch checklist

- [ ] Set `SITE_URL` to the confirmed domain; rebuild
- [ ] Configure form delivery and `FORM_TOKEN_SECRET`; submit a real test from each form (contact, support, bug)
- [ ] Add confirmed contact email, support email, address and registration number (only if appropriate)
- [ ] Have a lawyer review **all five legal pages**; resolve every highlighted `TO CONFIRM`; set effective date, jurisdiction, refund window; then `LEGAL_REVIEWED=true`
- [ ] Align refund/licence text with each marketplace's agreements
- [ ] Add real products to `products.ts` (screenshots, confirmed prices, live purchase links only)
- [ ] Publish documentation and add it to products/resources
- [ ] Add official social profile URLs
- [ ] Decide on analytics and consent; update the Cookie Policy accordingly
- [ ] Replace the generated OG image/logo if an official logo exists
- [ ] Run `npm run build`, `npm run check:links`; submit the sitemap to search engines
