import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { orderEvents, orders } from "@/db/schema";
import { notifyNewOrder } from "@/lib/notifications";

const orderSchema = z.object({
  locale: z.enum(["tr", "en"]).default("tr"),
  customerName: z.string().trim().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(80),
  productType: z.string().trim().min(2).max(80),
  woodType: z.string().trim().min(2).max(80),
  epoxy: z.string().trim().min(2).max(80),
  legStyle: z.string().trim().min(2).max(80),
  dimensions: z.string().trim().min(2).max(120),
  finish: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(2000).default(""),
});

function randomToken() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const parsed = orderSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "invalid-order", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    const data = parsed.data;
    const normalizedData = { ...data, email: data.email.toLowerCase() };
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const orderNumber = `WU-${new Date().getUTCFullYear()}-${randomToken().slice(0, 8).toUpperCase()}`;
    const trackingToken = randomToken();
    const db = getDb();
    await db.batch([
      db.insert(orders).values({ ...normalizedData, id, orderNumber, trackingToken, status: "received", createdAt: now, updatedAt: now }),
      db.insert(orderEvents).values({ id: crypto.randomUUID(), orderId: id, status: "received", publicNote: data.locale === "tr" ? "Sipariş talebiniz ekibimize ulaştı." : "Your request has reached our team.", createdAt: now }),
    ]);
    const notification = await notifyNewOrder({
      orderNumber,
      trackingToken,
      locale: data.locale,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      summary: `${data.productType} · ${data.woodType} · ${data.epoxy} · ${data.dimensions}`,
    }).catch(() => ({ sent: false, reason: "failed" }));
    await db.update(orders).set({ notificationStatus: notification.sent ? "sent" : notification.reason }).where((await import("drizzle-orm")).eq(orders.id, id));
    return NextResponse.json({ orderNumber, trackingToken, status: "received" }, { status: 201 });
  } catch (error) {
    console.error("order-create", error);
    return NextResponse.json({ error: "order-create-failed" }, { status: 500 });
  }
}
