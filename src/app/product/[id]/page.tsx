import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { formatNaira, timeAgo } from "@/lib/money";
import { ProductGallery } from "@/components/product-gallery";
import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/product-card";
import { categoryById } from "@/lib/categories";
import { listProducts } from "@/lib/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProductDetail(id);
  if (!detail) notFound();

  const user = await getCurrentUser();
  let favorited = false;
  if (user) {
    const rows = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.productId, id)))
      .limit(1);
    favorited = rows.length > 0;
  }

  const category = categoryById(detail.product.categoryId);
  const related = (await listProducts({ categoryId: detail.product.categoryId, limit: 8, currentUserId: user?.id ?? null })).filter(
    (p) => p.id !== id
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-xs text-slate-400">
        <Link href="/" className="hover:text-green-600">Home</Link> /{" "}
        {category && <Link href={`/category/${category.slug}`} className="hover:text-green-600">{category.name}</Link>} / {detail.product.title}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={detail.images} title={detail.product.title} />

        <div>
          {detail.product.status !== "active" && (
            <span className="mb-2 inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase text-white">
              {detail.product.status}
            </span>
          )}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{detail.product.title}</h1>
          <p className="mt-2 text-3xl font-extrabold text-green-700 dark:text-green-400">{formatNaira(detail.product.price)}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {detail.product.condition}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              📍 {detail.product.location}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Qty available: {detail.product.quantity}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Listed {timeAgo(detail.product.createdAt.toISOString())}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              👁️ {detail.product.viewsCount} views
            </span>
          </div>

          {detail.product.deliveryOptions && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <b>Delivery:</b> {detail.product.deliveryOptions}
            </p>
          )}

          <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{detail.product.description}</p>
          </div>

          <Link href={`/profile/${detail.seller.username}`} className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-green-600 text-lg font-bold text-white">
              {detail.seller.avatarUrl ? (
                <img src={detail.seller.avatarUrl} className="h-full w-full object-cover" alt="" />
              ) : (
                detail.seller.username.slice(0, 2).toUpperCase()
              )}
            </span>
            <div className="flex-1">
              <p className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-100">
                {detail.seller.username} {detail.seller.verified && <span title="Verified seller">✅</span>}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ⭐ {Number(detail.seller.rating).toFixed(1)} ({detail.seller.ratingCount} reviews) · {detail.seller.location}
              </p>
            </div>
            <span className="text-xs font-semibold text-green-600">View Profile →</span>
          </Link>

          <div className="mt-5">
            <ProductActions
              productId={detail.product.id}
              sellerId={detail.seller.id}
              loggedIn={Boolean(user)}
              isOwner={user?.id === detail.seller.id}
              initialFavorited={favorited}
            />
          </div>
        </div>
      </div>

      {detail.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Buyer Reviews</h2>
          <div className="mt-4 space-y-3">
            {detail.reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{r.buyer.username}</p>
                  <p className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                </div>
                {r.comment && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related Products</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
