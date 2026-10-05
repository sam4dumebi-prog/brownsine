import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { createSession, hashPassword } from "@/lib/auth";
import { newId } from "@/lib/ids";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid request body");

  const username = String(body.username ?? "").trim().toLowerCase();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const fullName = String(body.fullName ?? "").trim();
  const location = String(body.location ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!username || !/^[a-z0-9_]{3,20}$/.test(username)) {
    return jsonError("Username must be 3-20 characters (letters, numbers, underscore).");
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return jsonError("Please provide a valid email address.");
  }
  if (!password || password.length < 6) {
    return jsonError("Password must be at least 6 characters.");
  }
  if (!fullName) {
    return jsonError("Please provide your full name.");
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (existing.length > 0) {
    return jsonError("An account with this username or email already exists.", 409);
  }

  const passwordHash = await hashPassword(password);
  const id = newId("usr");

  await db.insert(users).values({
    id,
    username,
    email,
    passwordHash,
    fullName,
    location,
    phone,
  });

  await createSession(id);

  return jsonOk({ id, username, fullName });
}
