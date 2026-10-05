import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const items = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(30);

  return jsonOk({ items });
}

export async function PATCH() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, user.id));
  return jsonOk({ success: true });
}
