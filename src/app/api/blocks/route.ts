import { db } from "@/db";
import { blocks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const blockedId = String(body?.blockedId ?? "");
  if (!blockedId || blockedId === user.id) return jsonError("Invalid user to block.");

  const existing = await db
    .select()
    .from(blocks)
    .where(and(eq(blocks.blockerId, user.id), eq(blocks.blockedId, blockedId)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(blocks).where(eq(blocks.id, existing[0].id));
    return jsonOk({ blocked: false });
  }

  await db.insert(blocks).values({ id: newId("blk"), blockerId: user.id, blockedId });
  return jsonOk({ blocked: true });
}
