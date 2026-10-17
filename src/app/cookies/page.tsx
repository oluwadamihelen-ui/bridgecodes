import { LegalPage } from "@/components/LegalPage";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

const doc = legalDocs["cookies"];

export const metadata = pageMetadata({ title: doc.title, description: doc.description, path: "/cookies" });

export default function Page() {
  return <LegalPage slug="cookies" />;
}
