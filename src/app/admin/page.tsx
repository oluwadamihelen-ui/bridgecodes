import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/StatusBadge";
import { SeedBanner } from "@/components/admin/SeedBanner";
import { pendingFills, pendingSeeds } from "@/lib/admin-seed";
import { isAdmin } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/catalogue";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { saved } = await searchParams;
  const store = getStore();
  const products = await getAllProducts();
  const seeds = await pendingSeeds();
  const fills = seeds.length ? [] : await pendingFills();

  return (
    <>
      <div className="admin__head">
        <h1 style={{ fontSize: "1.8rem", margin: 0 }}>Products</h1>
        {store && <Link href="/admin/products/new" className="btn btn--primary">Add product</Link>}
      </div>

      {seeds.length > 0 && <SeedBanner names={seeds.map((p) => p.name)} />}
      {fills.length > 0 && <SeedBanner mode="fill" names={fills.map((p) => p.name)} />}

      {saved && <div className="notice notice--success" role="status">Saved. The website will show the change within moments.</div>}

      {!store && (
        <div className="note note--warn" role="alert">
          <p><strong>Storage is not connected yet, so products cannot be saved.</strong></p>
          <p>
            In Vercel, open your project → <em>Storage</em> (or <em>Marketplace</em>) → add <strong>Upstash Redis</strong> and connect it to this project,
            then redeploy. The README has step-by-step instructions.
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty"><h2>No products yet</h2><p>Add your first product. It stays hidden from the website until you tick “Published”.</p></div>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead><tr><th>Product</th><th>Category</th><th>Status</th><th>On website</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug}>
                  <td><strong>{p.name}</strong><br /><span className="muted">/products/{p.slug}</span></td>
                  <td>{p.category}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.published ? <span className="badge badge--available">Published</span> : <span className="badge">Draft (hidden)</span>}</td>
                  <td className="admin__actions">
                    {p.published && <a className="btn btn--secondary btn--sm" href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer">View</a>}
                    {store && <Link className="btn btn--secondary btn--sm" href={`/admin/products/${p.slug}`}>Edit</Link>}
                    {store && <DeleteButton slug={p.slug} name={p.name} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
