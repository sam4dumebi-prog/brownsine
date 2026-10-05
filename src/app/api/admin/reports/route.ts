import { db } from "@/db";
import { reports, users } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const rows = await db
    .select({ report: reports, reporter: users })
    .from(reports)
    .innerJoin(users, eq(reports.reporterId, users.id))
    .orderBy(desc(reports.createdAt));

  return jsonOk({
    items: rows.map((r) => ({
      id: r.report.id,
      targetType: r.report.targetType,
      targetId: r.report.targetId,
      reason: r.report.reason,
      status: r.report.status,
      createdAt: r.report.createdAt.toISOString(),
      reporter: { username: r.reporter.username },
    })),
  });
}

export async function PATCH(req: Request) {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const body = await req.json().catch(() => null);
  const reportId = String(body?.reportId ?? "");
  const status = String(body?.status ?? "");
  if (!reportId || !["open", "reviewed", "dismissed"].includes(status)) return jsonError("Invalid input");

  await db.update(reports).set({ status }).where(eq(reports.id, reportId));
  return jsonOk({ success: true });
}
