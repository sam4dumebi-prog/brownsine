import Link from "next/link";
import { listProducts } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";
import { ProductCard } from "@/components/product-card";
import { CategoryGrid } from "@/components/category-grid";
import { FeedPreview } from "@/components/feed-preview";

export const dynamic = "force-dynamic";

function SectionHeader({ title, href, subtitle }: { title: string; href: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <Link href={href} className="shrink-0 text-sm font-semibold text-green-600 hover:text-green-700">
        See all →
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const [featured, popular, recent, recommended] = await Promise.all([
    listProducts({ sort: "featured", limit: 8, currentUserId: user?.id ?? null }),
    listProducts({ sort: "popular", limit: 8, currentUserId: user?.id ?? null }),
    listProducts({ sort: "recent", limit: 8, currentUserId: user?.id ?? null }),
    listProducts({ sort: "recent", limit: 8, currentUserId: user?.id ?? null, categoryId: undefined }),
  ]);

  return (
    <main className="pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div className="flex flex-col justify-center animate-fade-in">
            <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Nigeria&apos;s Social Marketplace
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Buy, Sell &amp; Connect on <span className="text-amber-300">Okonjo Market</span>
            </h1>
            <p className="mt-4 max-w-lg text-green-50">
              Discover great deals from verified sellers across Nigeria — phones, cars, fashion, houses and more.
              List your own products in minutes and reach thousands of buyers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sell" className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-600">
                + Sell Something
              </Link>
              <Link href="/search" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-green-700 shadow-lg hover:bg-green-50">
                Browse Products
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div><p className="text-2xl font-bold">14+</p><p className="text-green-100">Categories</p></div>
              <div><p className="text-2xl font-bold">100%</p><p className="text-green-100">Naira Priced</p></div>
              <div><p className="text-2xl font-bold">24/7</p><p className="text-green-100">Buyer Support</p></div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4 self-center">
            {featured.slice(0, 4).map((p) => (
              <div key={p.id} className="animate-fade-in rounded-2xl bg-white/10 p-3 backdrop-blur">
                <div className="aspect-square overflow-hidden rounded-xl bg-white/20">
                  {p.coverImage && <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />}
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-medium">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader title="Browse Categories" href="/search" subtitle="Find exactly what you're looking for" />
        <CategoryGrid />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader title="Featured Products" href="/search?sort=featured" subtitle="Hand-picked top listings" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader title="Popular Products" href="/search?sort=popular" subtitle="Most viewed by buyers right now" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Recently Listed" href="/search?sort=recent" subtitle="Fresh listings from sellers" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Social Feed" href="/feed" subtitle="What sellers are sharing" />
            <FeedPreview loggedIn={Boolean(user)} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeader title="Recommended For You" href="/search" subtitle="Based on trending items across Okonjo Market" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-10 text-center text-white dark:bg-slate-800">
          <h3 className="text-2xl font-bold">Got something to sell?</h3>
          <p className="mt-2 text-slate-300">Join thousands of Nigerian sellers making money on Okonjo Market.</p>
          <Link href="/sell" className="mt-5 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-bold hover:bg-amber-600">
            Start Selling Now
          </Link>
        </div>
      </div>
    </main>
  );
}
