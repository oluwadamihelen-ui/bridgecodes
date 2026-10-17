import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";

/** Official Bridgecodes logo. The light variant (white wordmark) is for dark backgrounds. */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label={`${site.brand} home`}>
      <Image
        src={onDark ? "/brand/logo-light.png" : "/brand/logo.png"}
        alt={site.brand}
        width={760}
        height={159}
        priority={!onDark}
        sizes="190px"
        className="logo__img"
      />
    </Link>
  );
}
