import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { isAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <p><Link href="/admin">← All products</Link></p>
      <h1 style={{ fontSize: "1.8rem" }}>Add product</h1>
      <ProductForm />
    </>
  );
}
