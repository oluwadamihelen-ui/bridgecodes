/** Links starting with "/" are pages on this site; everything else opens in a new tab. */
export const isInternalHref = (href: string) => href.startsWith("/");
