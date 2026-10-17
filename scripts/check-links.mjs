#!/usr/bin/env node
/**
 * Crawls a running site (default http://localhost:3000), starting from the sitemap and "/",
 * follows every internal link and #fragment, and reports broken ones.
 *   npm run build && npm start &   then   npm run check:links
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const seen = new Map(); // path -> html|null
const broken = [];
const queue = ["/"];

const sm = await fetch(`${base}/sitemap.xml`).then((r) => r.text()).catch(() => "");
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) queue.push(new URL(m[1]).pathname);

while (queue.length) {
  const path = queue.pop();
  if (seen.has(path)) continue;
  const res = await fetch(base + path, { redirect: "manual" });
  if (res.status >= 300) { seen.set(path, null); broken.push(`${path} -> HTTP ${res.status}`); continue; }
  const html = await res.text();
  seen.set(path, html);
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|https?:)/.test(href)) continue;
    const [p] = href.split("#");
    if (p && p.startsWith("/")) queue.push(p);
  }
}
// Fragment check
for (const [path, html] of seen) {
  if (!html) continue;
  for (const m of html.matchAll(/<a\s[^>]*href="([^"#]*)#([^"]+)"/g)) {
    const target = m[1] === "" ? path : m[1];
    const page = seen.get(target);
    if (page && !new RegExp(`id="${m[2]}"`).test(page)) broken.push(`${path} -> ${target}#${m[2]} (missing anchor)`);
  }
}
console.log(`Checked ${seen.size} pages.`);
if (broken.length) { console.error("Broken links:\n" + [...new Set(broken)].join("\n")); process.exit(1); }
console.log("No broken internal links or anchors.");
