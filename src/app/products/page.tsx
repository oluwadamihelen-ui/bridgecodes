import { PageHero } from "@/components/PageHero";
import { ProductCatalogue } from "@/components/ProductCatalogue";
import { CtaBand } from "@/components/CtaBand";
import { Button } from "@/components/Button";
import { getProducts, productCategories } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Browse software products developed and owned by Bridgecodes, with category, status, documentation and official purchase information.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getProducts();
  return (
    <>
      <PageHero
        title="Software Products"
        intro="Software developed and owned by Bridgecodes. Every listing shows its real status, and purchase links appear only when they are live."
        crumbs={[{ name: "Products", path: "/products" }]}
      />
      <section className="section">
        <div className="container">
          {products.length > 0 ? (
            <ProductCatalogue products={products} categories={productCategories} />
          ) : (
            <div className="empty">
              <h2>Our product catalogue is being prepared</h2>
              <p>
                No products are published yet. When a product is ready, it will appear here with its description,
                status, documentation, licensing and official purchase or access options. We are working in these areas:
              </p>
              <ul className="category-chips" style={{ justifyContent: "center" }}>
                {productCategories.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <div className="btn-row btn-row--center" style={{ marginTop: 24 }}>
                <Button href="/contact">Ask about a product</Button>
                <Button href="/services" variant="secondary">Custom development</Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
