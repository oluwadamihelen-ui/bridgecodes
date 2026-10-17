"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";
import { productStatuses, type Product } from "@/content/products";

export function ProductCatalogue({ products, categories }: { products: Product[]; categories: readonly string[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!needle || p.name.toLowerCase().includes(needle)) &&
        (category === "all" || p.category === category) &&
        (status === "all" || p.status === status),
    );
  }, [products, q, category, status]);

  const filtered = q.trim() !== "" || category !== "all" || status !== "all";
  const reset = () => { setQ(""); setCategory("all"); setStatus("all"); };

  return (
    <div>
      <form className="filters" role="search" aria-label="Filter products" onSubmit={(e) => e.preventDefault()}>
        <div className="field filters__search">
          <label htmlFor="product-search">Search by product name</label>
          <div className="input-icon">
            <Icon name="search" size={18} />
            <input id="product-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" autoComplete="off" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="product-category">Category</label>
          <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="product-status">Status</label>
          <select id="product-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {Object.entries(productStatuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </form>

      <p className="results-count" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "product" : "products"}{filtered ? " match your filters" : ""}
      </p>

      {results.length > 0 ? (
        <div className="grid grid--3">
          {results.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      ) : (
        <div className="empty">
          <h3>No products match your search</h3>
          <p>Try a different name, or clear the filters.</p>
          <button type="button" className="btn btn--secondary btn--sm" onClick={reset}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
