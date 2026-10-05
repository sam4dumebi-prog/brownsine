import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonError, jsonOk } from "@/lib/http";
import { verifyPaystackTransaction } from "@/lib/paystack";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");
  if (!reference) return jsonError("reference is required");

  const rows = await db.select().from(payments).where(eq(payments.reference, reference)).limit(1);
  const payment = rows[0];
  if (!payment) return jsonError("Payment not found", 404);

  try {
    const result = await verifyPaystackTransaction(reference);
    const success = result.status === "success";

    await db
      .update(payments)
      .set({ status: success ? "success" : "failed" })
      .where(eq(payments.id, payment.id));

    await db
      .update(orders)
      .set({ status: success ? "payment_confirmed" : "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, payment.orderId));

    return jsonOk({ success, orderId: payment.orderId });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Verification failed");
  }
}
