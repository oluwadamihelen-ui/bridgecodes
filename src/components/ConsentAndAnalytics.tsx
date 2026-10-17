import { site } from "@/config/site";
import { Analytics } from "./Analytics";

export function ConsentAndAnalytics() {
  const { plausibleDomain, plausibleSrc, requiresConsent } = site.analytics;
  if (!plausibleDomain) return null;
  return <Analytics domain={plausibleDomain} src={plausibleSrc} requiresConsent={requiresConsent} />;
}
