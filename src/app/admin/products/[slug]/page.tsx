import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { isAdmin } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/catalogue";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const product = (await getAllProducts()).find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <>
      <p><Link href="/admin">← All products</Link></p>
      <h1 style={{ fontSize: "1.8rem" }}>Edit: {product.name}</h1>
      <ProductForm product={product} />
    </>
  );
}
