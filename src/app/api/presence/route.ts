import { db } from "@/db";
import { presence } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const existing = await db.select().from(presence).where(eq(presence.userId, user.id)).limit(1);
  if (existing.length > 0) {
    await db.update(presence).set({ lastSeenAt: new Date() }).where(eq(presence.userId, user.id));
  } else {
    await db.insert(presence).values({ userId: user.id });
  }

  return jsonOk({ success: true });
}
