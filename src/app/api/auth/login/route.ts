import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { createSession, verifyPassword } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid request body");

  const identifier = String(body.identifier ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!identifier || !password) {
    return jsonError("Please provide your username/email and password.");
  }

  const rows = await db
    .select()
    .from(users)
    .where(or(eq(users.username, identifier), eq(users.email, identifier)))
    .limit(1);

  const user = rows[0];
  if (!user) return jsonError("Invalid credentials.", 401);

  if (user.isSuspended) {
    return jsonError("This account has been suspended. Contact support.", 403);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return jsonError("Invalid credentials.", 401);

  await createSession(user.id);

  return jsonOk({ id: user.id, username: user.username });
}
