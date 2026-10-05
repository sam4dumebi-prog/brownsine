import { db } from "@/db";
import { shares } from "@/db/schema";
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
    .from(shares)
    .where(and(eq(shares.userId, user.id), eq(shares.postId, postId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(shares).values({ id: newId("shr"), userId: user.id, postId });
  }

  return jsonOk({ shared: true });
}
