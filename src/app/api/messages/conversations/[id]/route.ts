import { db } from "@/db";
import { conversations, messages, users, notifications, products, productImages } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, asc, eq, isNull, ne } from "drizzle-orm";

async function assertParticipant(conversationId: string, userId: string) {
  const rows = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  const convo = rows[0];
  if (!convo) return null;
  if (convo.userAId !== userId && convo.userBId !== userId) return null;
  return convo;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const convo = await assertParticipant(id, user.id);
  if (!convo) return jsonError("Conversation not found", 404);

  const otherId = convo.userAId === user.id ? convo.userBId : convo.userAId;
  const otherRows = await db.select().from(users).where(eq(users.id, otherId)).limit(1);

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const productIds = Array.from(new Set(msgs.map((m) => m.productId).filter((p): p is string => Boolean(p))));
  const productMap = new Map<string, { title: string; price: string; image: string | null }>();
  if (productIds.length) {
    const prods = await db.select().from(products).where(eq(products.id, productIds[0]));
    for (const pid of productIds) {
      const p = (await db.select().from(products).where(eq(products.id, pid)).limit(1))[0];
      if (p) {
        const img = (await db.select().from(productImages).where(eq(productImages.productId, pid)).limit(1))[0];
        productMap.set(pid, { title: p.title, price: p.price, image: img?.url ?? null });
      }
    }
  }

  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(and(eq(messages.conversationId, id), isNull(messages.readAt), ne(messages.senderId, user.id)));

  return jsonOk({
    other: otherRows[0]
      ? { id: otherRows[0].id, username: otherRows[0].username, avatarUrl: otherRows[0].avatarUrl }
      : null,
    messages: msgs.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.content,
      imageUrl: m.imageUrl,
      createdAt: m.createdAt.toISOString(),
      product: m.productId ? productMap.get(m.productId) ?? null : null,
    })),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const convo = await assertParticipant(id, user.id);
  if (!convo) return jsonError("Conversation not found", 404);

  const body = await req.json().catch(() => null);
  const content = String(body?.content ?? "").trim();
  const imageUrl = String(body?.imageUrl ?? "").trim();
  const productId = body?.productId ? String(body.productId) : null;

  if (!content && !imageUrl && !productId) return jsonError("Message cannot be empty.");

  const messageId = newId("msg");
  await db.insert(messages).values({
    id: messageId,
    conversationId: id,
    senderId: user.id,
    content,
    imageUrl,
    productId: productId ?? undefined,
  });

  await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, id));

  const otherId = convo.userAId === user.id ? convo.userBId : convo.userAId;
  await db.insert(notifications).values({
    id: newId("ntf"),
    userId: otherId,
    type: "message",
    content: `@${user.username} sent you a message.`,
    link: `/messages?c=${id}`,
  });

  return jsonOk({ id: messageId });
}
