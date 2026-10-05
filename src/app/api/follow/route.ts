import { db } from "@/db";
import { follows, notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const targetId = String(body?.targetId ?? "");
  if (!targetId || targetId === user.id) return jsonError("Invalid follow target.");

  const existing = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, user.id), eq(follows.followingId, targetId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(follows).where(eq(follows.id, existing[0].id));
    return jsonOk({ following: false });
  }

  await db.insert(follows).values({ id: newId("flw"), followerId: user.id, followingId: targetId });
  await db.insert(notifications).values({
    id: newId("ntf"),
    userId: targetId,
    type: "follow",
    content: `@${user.username} started following you.`,
    link: `/profile/${user.username}`,
  });

  return jsonOk({ following: true });
}
