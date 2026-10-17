import Link from "next/link";
import { site } from "@/config/site";

/** Geometric symbol: two pillars joined by an arch — a “bridge” built from code brackets. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#356DF3" />
      <path d="M7.500 24V15.500a8.500 8.500 0 0 1 17 0V24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M12.500 24v-8a3.500 3.500 0 0 1 7 0v8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className={`logo${onDark ? " logo--dark" : ""}`} aria-label={`${site.brand} home`}>
      <LogoMark />
      <span className="logo__word">
        Bridge<span>codes</span>
      </span>
    </Link>
  );
}
