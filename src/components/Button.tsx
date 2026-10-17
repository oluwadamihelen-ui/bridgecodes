import Link from "next/link";
import { Icon } from "./Icon";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light" | "outline-light" | "ghost";
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "primary", arrow, external, className = "" }: Props) {
  const cls = `btn btn--${variant} ${className}`.trim();
  const inner = (
    <>
      {children}
      {arrow && <Icon name="arrow" size={18} />}
    </>
  );
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link className={cls} href={href}>{inner}</Link>
  );
}
