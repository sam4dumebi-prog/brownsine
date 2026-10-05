import { db } from "@/db";
import { cartItems, products, productImages, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq, inArray } from "drizzle-orm";

async function getCart(userId: string) {
  const rows = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      product: products,
      seller: users,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .innerJoin(users, eq(products.sellerId, users.id))
    .where(eq(cartItems.userId, userId));

  const productIds = rows.map((r) => r.product.id);
  const imgs = productIds.length
    ? await db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(productImages.position)
    : [];
  const imageMap = new Map<string, string>();
  for (const img of imgs) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, img.url);
  }

  return rows.map((r) => ({
    cartItemId: r.cartItemId,
    quantity: r.quantity,
    product: {
      id: r.product.id,
      title: r.product.title,
      price: r.product.price,
      status: r.product.status,
      quantityAvailable: r.product.quantity,
      image: imageMap.get(r.product.id) ?? null,
      seller: { id: r.seller.id, username: r.seller.username },
    },
  }));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  const items = await getCart(user.id);
  return jsonOk({ items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  const quantity = Math.max(1, parseInt(body?.quantity, 10) || 1);
  if (!productId) return jsonError("productId is required");

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ id: newId("cart"), userId: user.id, productId, quantity });
  }

  const items = await getCart(user.id);
  return jsonOk({ items });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const cartItemId = String(body?.cartItemId ?? "");
  const quantity = Math.max(1, parseInt(body?.quantity, 10) || 1);
  if (!cartItemId) return jsonError("cartItemId is required");

  await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, user.id)));

  const items = await getCart(user.id);
  return jsonOk({ items });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const url = new URL(req.url);
  const cartItemId = url.searchParams.get("cartItemId");
  if (!cartItemId) return jsonError("cartItemId is required");

  await db.delete(cartItems).where(and(eq(cartItems.id, cartItemId), eq(cartItems.userId, user.id)));

  const items = await getCart(user.id);
  return jsonOk({ items });
}
