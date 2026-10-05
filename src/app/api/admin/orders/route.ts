import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { desc, eq, inArray } from "drizzle-orm";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const allOrders = await db
    .select({ order: orders, buyer: users })
    .from(orders)
    .innerJoin(users, eq(orders.buyerId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(200);

  const orderIds = allOrders.map((o) => o.order.id);
  const items = orderIds.length ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)) : [];
  const itemsByOrder = new Map<string, typeof items>();
  for (const it of items) {
    const arr = itemsByOrder.get(it.orderId) ?? [];
    arr.push(it);
    itemsByOrder.set(it.orderId, arr);
  }

  return jsonOk({
    items: allOrders.map((o) => ({
      ...o.order,
      buyer: { username: o.buyer.username, email: o.buyer.email },
      items: itemsByOrder.get(o.order.id) ?? [],
    })),
  });
}
