import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  return NextResponse.json({ orders: rows });
}
