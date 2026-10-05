import { db } from "@/db";
import { users, follows, products } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { listProducts } from "@/lib/products";

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
  const profile = rows[0];
  if (!profile) return jsonError("User not found", 404);

  const currentUser = await getCurrentUser();

  const [followersCountRes, followingCountRes, listingsCountRes] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(follows).where(eq(follows.followingId, profile.id)),
    db.select({ count: sql<number>`count(*)::int` }).from(follows).where(eq(follows.followerId, profile.id)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(and(eq(products.sellerId, profile.id), eq(products.status, "active"))),
  ]);

  let isFollowing = false;
  if (currentUser) {
    const followRow = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, currentUser.id), eq(follows.followingId, profile.id)))
      .limit(1);
    isFollowing = followRow.length > 0;
  }

  const listings = await listProducts({ sellerId: profile.id, status: "active", limit: 50 });

  return jsonOk({
    profile: {
      id: profile.id,
      username: profile.username,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      location: profile.location,
      verified: profile.verified,
      rating: profile.rating,
      ratingCount: profile.ratingCount,
      createdAt: profile.createdAt.toISOString(),
      isOwner: currentUser?.id === profile.id,
    },
    followersCount: followersCountRes[0]?.count ?? 0,
    followingCount: followingCountRes[0]?.count ?? 0,
    listingsCount: listingsCountRes[0]?.count ?? 0,
    isFollowing,
    listings,
  });
}
