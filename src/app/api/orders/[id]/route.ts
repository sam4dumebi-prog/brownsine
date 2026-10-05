import { db } from "@/db";
import { orders, orderItems, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";

const VALID_STATUSES = [
  "pending_payment",
  "payment_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = rows[0];
  if (!order) return jsonError("Order not found", 404);

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const isBuyer = order.buyerId === user.id;
  const isSeller = items.some((i) => i.sellerId === user.id);
  if (!isBuyer && !isSeller && user.role !== "admin") {
    return jsonError("You do not have access to this order.", 403);
  }

  return jsonOk({ order, items });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const status = String(body?.status ?? "");
  if (!VALID_STATUSES.includes(status)) return jsonError("Invalid status");

  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const order = rows[0];
  if (!order) return jsonError("Order not found", 404);

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const isSeller = items.some((i) => i.sellerId === user.id);
  if (!isSeller && user.role !== "admin") {
    return jsonError("Only the seller or an admin can update order status.", 403);
  }

  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));

  await db.insert(notifications).values({
    id: newId("ntf"),
    userId: order.buyerId,
    type: "order_update",
    content: `Your order status changed to ${status.replace("_", " ")}.`,
    link: `/orders/${id}`,
  });

  return jsonOk({ success: true });
}
