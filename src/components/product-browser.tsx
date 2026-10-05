"use client";

import { useEffect, useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { CATEGORIES } from "@/lib/categories";

type Sort = "recent" | "popular" | "featured" | "price_asc" | "price_desc";

export function ProductBrowser({
  initialQuery = "",
  initialCategoryId = "",
}: {
  initialQuery?: string;
  initialCategoryId?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sort, setSort] = useState<Sort>("recent");
  const [items, setItems] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category", categoryId);
    params.set("sort", sort);
    params.set("limit", "48");

    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, categoryId, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for products..."
          className="w-full max-w-sm rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-green-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-full border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <option value="recent">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <span className="text-sm text-slate-400">{loading ? "Loading..." : `${items.length} results`}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-slate-700">
          No products found. Try a different search or category.
        </div>
      )}
    </div>
  );
}
