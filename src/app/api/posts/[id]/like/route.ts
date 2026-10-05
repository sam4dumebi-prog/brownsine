import { db } from "@/db";
import { likes, notifications, posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq } from "drizzle-orm";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, user.id), eq(likes.postId, postId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(likes).where(eq(likes.id, existing[0].id));
    return jsonOk({ liked: false });
  }

  await db.insert(likes).values({ id: newId("lk"), userId: user.id, postId });

  const postRows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (postRows[0] && postRows[0].userId !== user.id) {
    await db.insert(notifications).values({
      id: newId("ntf"),
      userId: postRows[0].userId,
      type: "like",
      content: `@${user.username} liked your post.`,
      link: `/feed`,
    });
  }

  return jsonOk({ liked: true });
}
