import Link from "next/link";
import { footerNav, site } from "@/config/site";
import { Logo } from "./Logo";
import { Icon } from "./Icon";

const socialIcon: Record<string, string> = {
  LinkedIn: "linkedin", X: "x", GitHub: "github", YouTube: "youtube", Facebook: "facebook", Instagram: "instagram",
};

function Column({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="footer__title">{title}</h2>
      <ul>
        {links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
      </ul>
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo onDark />
          <p>
            {site.brand} is the software development and digital products brand of {site.legalOwner} We build and
            deliver technology solutions designed to solve practical problems.
          </p>
          {site.social.length > 0 && (
            <ul className="social" aria-label="Social profiles">
              {site.social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${site.brand} on ${s.name}`}>
                    <Icon name={socialIcon[s.name]} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Column title="Explore" links={footerNav.explore} />
        <Column title="Help" links={footerNav.help} />
        <Column title="Legal" links={footerNav.legal} />
      </div>
      <div className="container footer__bottom">
        <p>© {year} {site.brand}. All rights reserved.</p>
        <p>{site.ownershipStatement}</p>
      </div>
    </footer>
  );
}
