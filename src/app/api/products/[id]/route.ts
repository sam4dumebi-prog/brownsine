import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { getProductDetail } from "@/lib/products";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProductDetail(id);
  if (!detail) return jsonError("Product not found.", 404);

  await db
    .update(products)
    .set({ viewsCount: detail.product.viewsCount + 1 })
    .where(eq(products.id, id));

  return jsonOk(detail);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = rows[0];
  if (!product) return jsonError("Product not found.", 404);
  if (product.sellerId !== user.id && user.role !== "admin") {
    return jsonError("You cannot modify this listing.", 403);
  }

  const body = await req.json().catch(() => ({}));
  const patch: Partial<typeof products.$inferInsert> = {};

  if (typeof body.status === "string") patch.status = body.status;
  if (typeof body.title === "string") patch.title = body.title;
  if (typeof body.description === "string") patch.description = body.description;
  if (typeof body.price !== "undefined") patch.price = String(body.price);
  if (typeof body.quantity !== "undefined") patch.quantity = Number(body.quantity);
  if (typeof body.featured === "boolean" && user.role === "admin") patch.featured = body.featured;

  patch.updatedAt = new Date();

  await db.update(products).set(patch).where(eq(products.id, id));
  return jsonOk({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = rows[0];
  if (!product) return jsonError("Product not found.", 404);
  if (product.sellerId !== user.id && user.role !== "admin") {
    return jsonError("You cannot delete this listing.", 403);
  }

  await db.update(products).set({ status: "removed" }).where(eq(products.id, id));
  return jsonOk({ success: true });
}
