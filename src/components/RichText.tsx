import Link from "next/link";
import { Fragment } from "react";

const TOKEN = /(\[\[[^\]]+\]\]|\[[^\]]+\]\([^)]+\))/g;

/**
 * Renders plain text with two tiny extensions:
 *   [label](/internal-or-https-url)  -> link
 *   [[TO CONFIRM: ...]]              -> highlighted "needs review" marker
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        const marker = part.match(/^\[\[(.+)\]\]$/);
        if (marker) return <mark key={i} className="tbc">{marker[1]}</mark>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return /^https?:/.test(href) ? (
            <a key={i} href={href} rel="noopener noreferrer" target="_blank">{label}</a>
          ) : (
            <Link key={i} href={href}>{label}</Link>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
