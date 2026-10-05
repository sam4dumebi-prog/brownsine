import { db } from "@/db";
import { users } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const items = await db.select().from(users).orderBy(desc(users.createdAt));
  return jsonOk({
    items: items.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      verified: u.verified,
      isSuspended: u.isSuspended,
      createdAt: u.createdAt.toISOString(),
    })),
  });
}

export async function PATCH(req: Request) {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const userId = String(body?.userId ?? "");
  if (!userId) return jsonError("userId is required");

  const patch: Partial<typeof users.$inferInsert> = {};
  if (typeof body.isSuspended === "boolean") patch.isSuspended = body.isSuspended;
  if (typeof body.verified === "boolean") patch.verified = body.verified;
  if (typeof body.role === "string" && ["user", "admin"].includes(body.role)) patch.role = body.role;

  await db.update(users).set(patch).where(eq(users.id, userId));
  return jsonOk({ success: true });
}
