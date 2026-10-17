import { count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { media, orderEvents, orders, siteContent } from "@/db/schema";
import { getAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const configured = Boolean(process.env.DATABASE_URL);
  let database: { configured: boolean; ok: boolean; counts?: Record<string, number> } = { configured, ok: false };
  if (configured) {
    try {
      const db = getDb();
      const [[orderCount], [eventCount], [contentCount], [mediaCount]] = await Promise.all([
        db.select({ value: count() }).from(orders), db.select({ value: count() }).from(orderEvents), db.select({ value: count() }).from(siteContent), db.select({ value: count() }).from(media),
      ]);
      database = { configured: true, ok: true, counts: { orders: orderCount.value, events: eventCount.value, content: contentCount.value, media: mediaCount.value } };
    } catch {
      database = { configured: true, ok: false };
    }
  }
  return NextResponse.json({
    database,
    storage: { configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN) },
    email: { configured: Boolean(process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL), senderConfigured: Boolean(process.env.ORDER_FROM_EMAIL) },
    admin: { configured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET) },
  });
}
