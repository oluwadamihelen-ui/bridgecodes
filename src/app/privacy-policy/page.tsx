import { LegalPage } from "@/components/LegalPage";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs["privacy-policy"];

export const metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/privacy-policy" });

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}
