import { db } from "@/db";
import { orders, orderItems, products, cartItems, payments, notifications, productImages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq, inArray, desc } from "drizzle-orm";
import { paystackEnabled, initializePaystackTransaction } from "@/lib/paystack";

const DELIVERY_FEE = 2000;

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const url = new URL(req.url);
  const role = url.searchParams.get("role") ?? "buyer";

  if (role === "seller") {
    const items = await db
      .select({ item: orderItems, order: orders })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orderItems.sellerId, user.id))
      .orderBy(desc(orders.createdAt));

    return jsonOk({
      items: items.map((r) => ({ ...r.item, order: r.order })),
    });
  }

  const myOrders = await db.select().from(orders).where(eq(orders.buyerId, user.id)).orderBy(desc(orders.createdAt));
  const orderIds = myOrders.map((o) => o.id);
  const items = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];

  const itemsByOrder = new Map<string, typeof items>();
  for (const it of items) {
    const arr = itemsByOrder.get(it.orderId) ?? [];
    arr.push(it);
    itemsByOrder.set(it.orderId, arr);
  }

  return jsonOk({
    items: myOrders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] })),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid request body");

  const customerName = String(body.customerName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = String(body.city ?? "").trim();
  const state = String(body.state ?? "").trim();
  const paymentMethod = String(body.paymentMethod ?? "bank_transfer");
  const requested: { productId: string; quantity: number }[] = Array.isArray(body.items) ? body.items : [];

  if (!customerName || !phone || !address || !city || !state) {
    return jsonError("Please fill in all delivery details.");
  }
  if (requested.length === 0) return jsonError("Your cart is empty.");

  const productIds = requested.map((r) => r.productId);
  const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const itemsToInsert: (typeof orderItems.$inferInsert)[] = [];

  for (const req_ of requested) {
    const product = productMap.get(req_.productId);
    if (!product || product.status !== "active") {
      return jsonError(`One of the products in your cart is no longer available.`);
    }
    const qty = Math.max(1, req_.quantity);
    const lineTotal = parseFloat(product.price) * qty;
    subtotal += lineTotal;

    const img = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.position)
      .limit(1);

    itemsToInsert.push({
      id: newId("oitem"),
      orderId: "",
      productId: product.id,
      sellerId: product.sellerId,
      title: product.title,
      price: product.price,
      quantity: qty,
      imageUrl: img[0]?.url ?? "",
    });
  }

  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const orderId = newId("ord");

  await db.insert(orders).values({
    id: orderId,
    buyerId: user.id,
    status: "pending_payment",
    subtotal: String(subtotal),
    deliveryFee: String(deliveryFee),
    total: String(total),
    customerName,
    phone,
    address,
    city,
    state,
    paymentMethod,
  });

  await db.insert(orderItems).values(itemsToInsert.map((it) => ({ ...it, orderId })));

  // Remove purchased items from the buyer's cart
  await db.delete(cartItems).where(and(eq(cartItems.userId, user.id), inArray(cartItems.productId, productIds)));

  // Notify sellers
  const sellerIds = Array.from(new Set(itemsToInsert.map((i) => i.sellerId)));
  await db.insert(notifications).values(
    sellerIds.map((sellerId) => ({
      id: newId("ntf"),
      userId: sellerId,
      type: "new_order",
      content: `You have a new order from ${customerName}.`,
      link: `/dashboard/orders`,
    }))
  );

  const reference = newId("pay");

  if (paymentMethod === "paystack" && paystackEnabled()) {
    try {
      const origin = new URL(req.url).origin;
      const tx = await initializePaystackTransaction({
        email: user.email,
        amountNaira: total,
        reference,
        callbackUrl: `${origin}/orders/${orderId}?verify=${reference}`,
      });
      await db.insert(payments).values({
        id: newId("pmt"),
        orderId,
        provider: "paystack",
        reference,
        amount: String(total),
        status: "pending",
      });
      return jsonOk({ orderId, authorizationUrl: tx.authorization_url });
    } catch (err) {
      return jsonError(err instanceof Error ? err.message : "Payment initialization failed.");
    }
  }

  // Simulated / manual payment methods (bank transfer, card, flutterwave, opay demo mode)
  const simulatedStatus = paymentMethod === "bank_transfer" ? "pending" : "success";
  await db.insert(payments).values({
    id: newId("pmt"),
    orderId,
    provider: paymentMethod,
    reference,
    amount: String(total),
    status: simulatedStatus,
  });

  await db
    .update(orders)
    .set({ status: simulatedStatus === "success" ? "payment_confirmed" : "pending_payment", paymentReference: reference })
    .where(eq(orders.id, orderId));

  return jsonOk({ orderId, authorizationUrl: null });
}
