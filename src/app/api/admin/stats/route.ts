import { db } from "@/db";
import { users, products, orders, reports, payments } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/http";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const [userCount, productCount, orderCount, openReports, revenueRow] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(users),
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db.select({ count: sql<number>`count(*)::int` }).from(reports).where(eq(reports.status, "open")),
    db.select({ total: sql<string>`coalesce(sum(${payments.amount}),0)` }).from(payments).where(eq(payments.status, "success")),
  ]);

  return jsonOk({
    users: userCount[0]?.count ?? 0,
    products: productCount[0]?.count ?? 0,
    orders: orderCount[0]?.count ?? 0,
    openReports: openReports[0]?.count ?? 0,
    revenue: revenueRow[0]?.total ?? "0",
  });
}
