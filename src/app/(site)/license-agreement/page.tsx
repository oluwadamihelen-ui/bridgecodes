import { LegalPage } from "@/components/LegalPage";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs["license-agreement"];

export const metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/license-agreement" });

export default function Page() {
  return <LegalPage slug="license-agreement" />;
}
