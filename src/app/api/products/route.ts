import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { listProducts } from "@/lib/products";
import { categoryById } from "@/lib/categories";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const categoryId = url.searchParams.get("category") ?? undefined;
  const sellerId = url.searchParams.get("seller") ?? undefined;
  const sort = (url.searchParams.get("sort") as any) ?? undefined;
  const status = url.searchParams.get("status") ?? "active";
  const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined;

  const user = await getCurrentUser();

  const items = await listProducts({
    q,
    categoryId,
    sellerId,
    sort,
    status,
    limit,
    currentUserId: user?.id ?? null,
  });

  return jsonOk({ items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("You must be logged in to list a product.", 401);
  if (user.isSuspended) return jsonError("Your account is suspended.", 403);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.");

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const categoryId = String(body.categoryId ?? "");
  const price = Number(body.price);
  const condition = body.condition === "new" ? "new" : "used";
  const location = String(body.location ?? "").trim();
  const quantity = Math.max(1, parseInt(body.quantity, 10) || 1);
  const deliveryOptions = String(body.deliveryOptions ?? "").trim();
  const images: string[] = Array.isArray(body.images) ? body.images.slice(0, 8) : [];

  if (!title || title.length < 3) return jsonError("Product name must be at least 3 characters.");
  if (!description || description.length < 10)
    return jsonError("Please add a more detailed description (min 10 characters).");
  if (!categoryById(categoryId)) return jsonError("Please select a valid category.");
  if (!price || price <= 0) return jsonError("Please set a valid price.");
  if (!location) return jsonError("Please add a location.");
  if (images.length === 0) return jsonError("Please upload at least one product image.");

  const id = newId("prd");

  await db.insert(products).values({
    id,
    sellerId: user.id,
    categoryId,
    title,
    description,
    price: String(price),
    condition,
    location,
    quantity,
    deliveryOptions,
  });

  await db.insert(productImages).values(
    images.map((url, index) => ({
      id: newId("img"),
      productId: id,
      url,
      position: index,
    }))
  );

  return jsonOk({ id });
}
