import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductEnquiryPage } from "@/components/ProductEnquiryPage";
import { getProduct, getProducts } from "@/lib/catalogue";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

// Products saved in the admin render on first visit; unknown slugs return 404.
export const dynamicParams = true;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: `Purchase enquiry: ${p.name}`,
    description: `Ask about purchasing ${p.name} from Bridgecodes.`,
    path: `/products/${p.slug}/purchase`,
    noindex: true,
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  return <ProductEnquiryPage product={p} kind="purchase" />;
}
