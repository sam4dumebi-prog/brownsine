import { db } from "@/db";
import { reviews, users, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  const rating = Math.min(5, Math.max(1, parseInt(body?.rating, 10) || 0));
  const comment = String(body?.comment ?? "").trim();

  if (!productId || !rating) return jsonError("Please provide a rating between 1 and 5.");

  const productRows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const product = productRows[0];
  if (!product) return jsonError("Product not found", 404);

  await db.insert(reviews).values({
    id: newId("rv"),
    sellerId: product.sellerId,
    buyerId: user.id,
    productId,
    rating,
    comment,
  });

  const agg = await db
    .select({ avg: sql<string>`avg(${reviews.rating})`, count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(eq(reviews.sellerId, product.sellerId));

  await db
    .update(users)
    .set({ rating: agg[0]?.avg ?? "0", ratingCount: agg[0]?.count ?? 0 })
    .where(eq(users.id, product.sellerId));

  return jsonOk({ success: true });
}
