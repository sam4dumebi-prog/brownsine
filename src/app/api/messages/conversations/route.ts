import { db } from "@/db";
import { conversations, messages, users, presence } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq, or, desc, sql, isNull } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const rows = await db
    .select()
    .from(conversations)
    .where(or(eq(conversations.userAId, user.id), eq(conversations.userBId, user.id)))
    .orderBy(desc(conversations.lastMessageAt));

  const results = [];
  for (const c of rows) {
    const otherId = c.userAId === user.id ? c.userBId : c.userAId;
    const otherRows = await db.select().from(users).where(eq(users.id, otherId)).limit(1);
    const other = otherRows[0];
    if (!other) continue;

    const lastMsgRows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, c.id))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    const unreadRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.conversationId, c.id), isNull(messages.readAt), sql`${messages.senderId} != ${user.id}`));

    const presenceRows = await db.select().from(presence).where(eq(presence.userId, other.id)).limit(1);
    const online = presenceRows[0] ? Date.now() - presenceRows[0].lastSeenAt.getTime() < 60_000 : false;

    results.push({
      id: c.id,
      other: { id: other.id, username: other.username, avatarUrl: other.avatarUrl, online },
      lastMessage: lastMsgRows[0]
        ? { content: lastMsgRows[0].content, imageUrl: lastMsgRows[0].imageUrl, createdAt: lastMsgRows[0].createdAt.toISOString() }
        : null,
      unreadCount: unreadRows[0]?.count ?? 0,
      lastMessageAt: c.lastMessageAt.toISOString(),
    });
  }

  return jsonOk({ items: results });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const targetId = String(body?.userId ?? "");
  if (!targetId || targetId === user.id) return jsonError("Invalid conversation target.");

  const [a, b] = [user.id, targetId].sort();

  const existing = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userAId, a), eq(conversations.userBId, b)))
    .limit(1);

  let conversationId: string;
  if (existing.length > 0) {
    conversationId = existing[0].id;
  } else {
    conversationId = newId("conv");
    await db.insert(conversations).values({ id: conversationId, userAId: a, userBId: b });
  }

  return jsonOk({ id: conversationId });
}
