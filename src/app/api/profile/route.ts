import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const patch: Partial<typeof users.$inferInsert> = {};

  if (typeof body.fullName === "string") patch.fullName = body.fullName.trim();
  if (typeof body.bio === "string") patch.bio = body.bio.trim().slice(0, 300);
  if (typeof body.location === "string") patch.location = body.location.trim();
  if (typeof body.phone === "string") patch.phone = body.phone.trim();
  if (typeof body.avatarUrl === "string") patch.avatarUrl = body.avatarUrl;

  await db.update(users).set(patch).where(eq(users.id, user.id));
  return jsonOk({ success: true });
}
