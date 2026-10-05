import { db } from "@/db";
import { favorites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq } from "drizzle-orm";
import { listProducts } from "@/lib/products";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const favRows = await db.select().from(favorites).where(eq(favorites.userId, user.id));
  const productIds = new Set(favRows.map((f) => f.productId));
  const all = await listProducts({ status: "all", limit: 100, currentUserId: user.id });
  const items = all.filter((p) => productIds.has(p.id));
  return jsonOk({ items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  if (!productId) return jsonError("productId is required");

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return jsonOk({ favorited: false });
  }

  await db.insert(favorites).values({ id: newId("fav"), userId: user.id, productId });
  return jsonOk({ favorited: true });
}
