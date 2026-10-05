import { db } from "@/db";
import { products, orderItems, orders, favorites, messages, conversations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { and, eq, inArray, ne, isNull, sql } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const myProducts = await db.select().from(products).where(eq(products.sellerId, user.id));
  const productIds = myProducts.map((p) => p.id);

  const myOrderItems = productIds.length
    ? await db.select().from(orderItems).where(eq(orderItems.sellerId, user.id))
    : [];

  const orderIds = Array.from(new Set(myOrderItems.map((i) => i.orderId)));
  const relatedOrders = orderIds.length ? await db.select().from(orders).where(inArray(orders.id, orderIds)) : [];
  const orderStatusMap = new Map(relatedOrders.map((o) => [o.id, o.status]));

  const revenue = myOrderItems
    .filter((i) => {
      const status = orderStatusMap.get(i.orderId);
      return status === "delivered" || status === "shipped" || status === "processing" || status === "payment_confirmed";
    })
    .reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  const totalViews = myProducts.reduce((sum, p) => sum + p.viewsCount, 0);

  const favoritesCount = productIds.length
    ? (await db.select({ count: sql<number>`count(*)::int` }).from(favorites).where(inArray(favorites.productId, productIds)))[0]?.count ?? 0
    : 0;

  const myConvos = await db
    .select()
    .from(conversations)
    .where(sql`${conversations.userAId} = ${user.id} or ${conversations.userBId} = ${user.id}`);
  const convoIds = myConvos.map((c) => c.id);
  const unreadMessages = convoIds.length
    ? (
        await db
          .select({ count: sql<number>`count(*)::int` })
          .from(messages)
          .where(and(inArray(messages.conversationId, convoIds), isNull(messages.readAt), ne(messages.senderId, user.id)))
      )[0]?.count ?? 0
    : 0;

  return jsonOk({
    productsCount: myProducts.length,
    activeCount: myProducts.filter((p) => p.status === "active").length,
    soldCount: myProducts.filter((p) => p.status === "sold").length,
    ordersCount: orderIds.length,
    revenue,
    totalViews,
    favoritesCount,
    unreadMessages,
  });
}
