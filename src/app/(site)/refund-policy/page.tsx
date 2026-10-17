import { LegalPage } from "@/components/LegalPage";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs["refund-policy"];

export const metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/refund-policy" });

export default function Page() {
  return <LegalPage slug="refund-policy" />;
}
