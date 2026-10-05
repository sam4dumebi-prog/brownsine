import { ProductBrowser } from "@/components/product-browser";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Browse Products</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Discover products from verified sellers across Nigeria.</p>
      <div className="mt-6">
        <ProductBrowser initialQuery={q ?? ""} initialCategoryId={category ?? ""} />
      </div>
    </main>
  );
}
