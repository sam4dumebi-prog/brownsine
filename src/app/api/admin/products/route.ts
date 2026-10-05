import { db } from "@/db";
import { isAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { listProducts } from "@/lib/products";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const items = await listProducts({ status: "all", limit: 200 });
  return jsonOk({ items });
}

export async function PATCH(req: Request) {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  const status = String(body?.status ?? "");
  if (!productId || !status) return jsonError("productId and status are required");

  await db.update(products).set({ status, updatedAt: new Date() }).where(eq(products.id, productId));
  return jsonOk({ success: true });
}
