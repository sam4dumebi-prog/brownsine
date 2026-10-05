import { db } from "@/db";
import { comments, users, posts, notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { eq, asc } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const rows = await db
    .select({ comment: comments, author: users })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(asc(comments.createdAt));

  return jsonOk({
    items: rows.map((r) => ({
      id: r.comment.id,
      content: r.comment.content,
      createdAt: r.comment.createdAt.toISOString(),
      author: { username: r.author.username, avatarUrl: r.author.avatarUrl },
    })),
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const content = String(body?.content ?? "").trim();
  if (!content) return jsonError("Comment cannot be empty.");

  const id = newId("cm");
  await db.insert(comments).values({ id, postId, userId: user.id, content });

  const postRows = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (postRows[0] && postRows[0].userId !== user.id) {
    await db.insert(notifications).values({
      id: newId("ntf"),
      userId: postRows[0].userId,
      type: "comment",
      content: `@${user.username} commented on your post.`,
      link: `/feed`,
    });
  }

  return jsonOk({ id });
}
