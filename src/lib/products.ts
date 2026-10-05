import { db } from "@/db";
import { products, productImages, users, favorites, reviews } from "@/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";

export type ProductCard = {
  id: string;
  title: string;
  price: string;
  condition: string;
  location: string;
  status: string;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  coverImage: string | null;
  seller: { id: string; username: string; avatarUrl: string; verified: boolean };
  favorited?: boolean;
};

async function attachImages<T extends { id: string }>(rows: T[]): Promise<Map<string, string[]>> {
  if (rows.length === 0) return new Map();
  const ids = rows.map((r) => r.id);
  const imgs = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(productImages.position);
  const map = new Map<string, string[]>();
  for (const img of imgs) {
    const arr = map.get(img.productId) ?? [];
    arr.push(img.url);
    map.set(img.productId, arr);
  }
  return map;
}

export async function listProducts(opts: {
  q?: string;
  categoryId?: string;
  sellerId?: string;
  sort?: "featured" | "popular" | "recent" | "price_asc" | "price_desc";
  status?: string;
  limit?: number;
  currentUserId?: string | null;
}): Promise<ProductCard[]> {
  const conditions = [];
  if (opts.status !== "all") {
    conditions.push(eq(products.status, opts.status ?? "active"));
  }
  if (opts.categoryId) conditions.push(eq(products.categoryId, opts.categoryId));
  if (opts.sellerId) conditions.push(eq(products.sellerId, opts.sellerId));
  if (opts.q) {
    conditions.push(sql`(${products.title} ILIKE ${"%" + opts.q + "%"} OR ${products.description} ILIKE ${"%" + opts.q + "%"})`);
  }

  let orderBy = desc(products.createdAt);
  if (opts.sort === "popular") orderBy = desc(products.viewsCount);
  if (opts.sort === "price_asc") orderBy = sql`${products.price} asc` as any;
  if (opts.sort === "price_desc") orderBy = sql`${products.price} desc` as any;

  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      price: products.price,
      condition: products.condition,
      location: products.location,
      status: products.status,
      featured: products.featured,
      viewsCount: products.viewsCount,
      createdAt: products.createdAt,
      sellerId: users.id,
      sellerUsername: users.username,
      sellerAvatar: users.avatarUrl,
      sellerVerified: users.verified,
    })
    .from(products)
    .innerJoin(users, eq(products.sellerId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(opts.sort === "featured" ? desc(products.featured) : orderBy)
    .limit(opts.limit ?? 24);

  const imageMap = await attachImages(rows);

  let favoritedSet = new Set<string>();
  if (opts.currentUserId) {
    const favRows = await db
      .select({ productId: favorites.productId })
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, opts.currentUserId),
          inArray(
            favorites.productId,
            rows.map((r) => r.id)
          )
        )
      );
    favoritedSet = new Set(favRows.map((f) => f.productId));
  }

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    price: r.price,
    condition: r.condition,
    location: r.location,
    status: r.status,
    featured: r.featured,
    viewsCount: r.viewsCount,
    createdAt: r.createdAt.toISOString(),
    coverImage: imageMap.get(r.id)?.[0] ?? null,
    seller: {
      id: r.sellerId,
      username: r.sellerUsername,
      avatarUrl: r.sellerAvatar,
      verified: r.sellerVerified,
    },
    favorited: favoritedSet.has(r.id),
  }));
}

export async function getProductDetail(id: string) {
  const rows = await db
    .select()
    .from(products)
    .innerJoin(users, eq(products.sellerId, users.id))
    .where(eq(products.id, id))
    .limit(1);

  if (rows.length === 0) return null;
  const row = rows[0];

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(productImages.position);

  const productReviews = await db
    .select({ review: reviews, buyer: users })
    .from(reviews)
    .innerJoin(users, eq(reviews.buyerId, users.id))
    .where(eq(reviews.productId, id))
    .orderBy(desc(reviews.createdAt));

  return {
    product: row.products,
    seller: row.users,
    images: images.map((i) => i.url),
    reviews: productReviews.map((r) => ({
      id: r.review.id,
      rating: r.review.rating,
      comment: r.review.comment,
      createdAt: r.review.createdAt.toISOString(),
      buyer: { username: r.buyer.username, avatarUrl: r.buyer.avatarUrl },
    })),
  };
}
