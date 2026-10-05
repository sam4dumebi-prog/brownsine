import { db } from "@/db";
import { posts, postMedia, users, likes, comments, shares, products, productImages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { desc, eq, inArray, sql } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId") ?? undefined;
  const user = await getCurrentUser();

  const rows = await db
    .select({ post: posts, author: users })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .where(userId ? eq(posts.userId, userId) : undefined)
    .orderBy(desc(posts.createdAt))
    .limit(30);

  const postIds = rows.map((r) => r.post.id);
  const productIds = rows.map((r) => r.post.productId).filter((p): p is string => Boolean(p));

  const [media, likeCounts, commentCounts, shareCounts, myLikes, relatedProducts] = await Promise.all([
    postIds.length ? db.select().from(postMedia).where(inArray(postMedia.postId, postIds)) : Promise.resolve([]),
    postIds.length
      ? db.select({ postId: likes.postId, count: sql<number>`count(*)::int` }).from(likes).where(inArray(likes.postId, postIds)).groupBy(likes.postId)
      : Promise.resolve([]),
    postIds.length
      ? db.select({ postId: comments.postId, count: sql<number>`count(*)::int` }).from(comments).where(inArray(comments.postId, postIds)).groupBy(comments.postId)
      : Promise.resolve([]),
    postIds.length
      ? db.select({ postId: shares.postId, count: sql<number>`count(*)::int` }).from(shares).where(inArray(shares.postId, postIds)).groupBy(shares.postId)
      : Promise.resolve([]),
    user && postIds.length
      ? db.select({ postId: likes.postId }).from(likes).where(inArray(likes.postId, postIds))
      : Promise.resolve([]),
    productIds.length ? db.select().from(products).where(inArray(products.id, productIds)) : Promise.resolve([]),
  ]);

  const productImgs = productIds.length
    ? await db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(productImages.position)
    : [];
  const productImgMap = new Map<string, string>();
  for (const img of productImgs) {
    if (!productImgMap.has(img.productId)) productImgMap.set(img.productId, img.url);
  }
  const productMap = new Map(relatedProducts.map((p) => [p.id, p]));

  const mediaMap = new Map<string, { url: string; type: string }[]>();
  for (const m of media) {
    const arr = mediaMap.get(m.postId) ?? [];
    arr.push({ url: m.url, type: m.type });
    mediaMap.set(m.postId, arr);
  }
  const likeMap = new Map(likeCounts.map((l) => [l.postId, l.count]));
  const commentMap = new Map(commentCounts.map((c) => [c.postId, c.count]));
  const shareMap = new Map(shareCounts.map((s) => [s.postId, s.count]));
  const myLikedSet = new Set(
    user
      ? (await db.select({ postId: likes.postId }).from(likes).where(eq(likes.userId, user.id))).map((l) => l.postId)
      : []
  );

  return jsonOk({
    items: rows.map((r) => {
      const product = r.post.productId ? productMap.get(r.post.productId) : null;
      return {
        id: r.post.id,
        content: r.post.content,
        createdAt: r.post.createdAt.toISOString(),
        author: {
          id: r.author.id,
          username: r.author.username,
          avatarUrl: r.author.avatarUrl,
          verified: r.author.verified,
        },
        media: mediaMap.get(r.post.id) ?? [],
        likeCount: likeMap.get(r.post.id) ?? 0,
        commentCount: commentMap.get(r.post.id) ?? 0,
        shareCount: shareMap.get(r.post.id) ?? 0,
        likedByMe: myLikedSet.has(r.post.id),
        product: product
          ? {
              id: product.id,
              title: product.title,
              price: product.price,
              image: productImgMap.get(product.id) ?? null,
            }
          : null,
      };
    }),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const content = String(body?.content ?? "").trim();
  const media: { url: string; type: string }[] = Array.isArray(body?.media) ? body.media : [];
  const productId = body?.productId ? String(body.productId) : null;

  if (!content && media.length === 0) return jsonError("Write something or attach media to post.");

  const id = newId("post");
  await db.insert(posts).values({ id, userId: user.id, content, productId: productId ?? undefined });

  if (media.length > 0) {
    await db.insert(postMedia).values(
      media.map((m) => ({ id: newId("pm"), postId: id, url: m.url, type: m.type === "video" ? "video" : "image" }))
    );
  }

  return jsonOk({ id });
}
