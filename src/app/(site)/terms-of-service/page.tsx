import { LegalPage } from "@/components/LegalPage";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs["terms-of-service"];

export const metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/terms-of-service" });

export default function Page() {
  return <LegalPage slug="terms-of-service" />;
}
