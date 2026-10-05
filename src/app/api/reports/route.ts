import { db } from "@/db";
import { reports } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { newId } from "@/lib/ids";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const targetType = String(body?.targetType ?? "");
  const targetId = String(body?.targetId ?? "");
  const reason = String(body?.reason ?? "").trim();

  if (!["user", "product", "post"].includes(targetType)) return jsonError("Invalid report target.");
  if (!targetId || !reason) return jsonError("Please describe why you are reporting this.");

  await db.insert(reports).values({
    id: newId("rpt"),
    reporterId: user.id,
    targetType,
    targetId,
    reason,
  });

  return jsonOk({ success: true });
}
