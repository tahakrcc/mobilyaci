import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { orderEvents, orders } from "@/db/schema";
import { formatTurkishMobile, normalizeEmail } from "@/lib/contact-validation";
import { notifyNewOrder } from "@/lib/notifications";
import { orderChoiceLabel } from "@/lib/order-details";

const orderSchema = z.object({
  locale: z.enum(["tr", "en"]).default("tr"),
  customerName: z.string().trim().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().regex(/^5\d{2}-\d{3}-\d{4}$/),
  city: z.string().trim().min(2).max(80),
  productType: z.string().trim().min(2).max(80),
  woodType: z.string().trim().min(2).max(80),
  epoxy: z.string().trim().min(2).max(80),
  legStyle: z.string().trim().min(2).max(80),
  dimensions: z.string().trim().min(2).max(120),
  finish: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(2000).default(""),
  upholstery: z.enum(["project-fabric", "leather", "boucle", "customer-choice"]).optional(),
  quantity: z.string().trim().max(120).optional(),
});

function randomToken() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as unknown;
    const record = payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : null;
    const normalizedPayload = record ? {
      ...record,
      email: typeof record.email === "string" ? normalizeEmail(record.email) : record.email,
      phone: typeof record.phone === "string" ? formatTurkishMobile(record.phone) : record.phone,
    } : payload;
    const parsed = orderSchema.safeParse(normalizedPayload);
    if (!parsed.success) return NextResponse.json({ error: "invalid-order", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    const data = parsed.data;
    const { upholstery, quantity, ...orderData } = data;
    const seating = ["chair", "bar-chair", "set"].includes(data.productType);
    const storedNotes = [
      data.notes,
      seating && upholstery ? `${data.locale === "tr" ? "Döşeme" : "Upholstery"}: ${orderChoiceLabel("upholstery", upholstery, data.locale)}` : "",
      seating && quantity ? `${data.locale === "tr" ? "Model / adet" : "Model / quantity"}: ${quantity}` : "",
    ].filter(Boolean).join("\n\n");
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const orderNumber = `WU-${new Date().getUTCFullYear()}-${randomToken().slice(0, 8).toUpperCase()}`;
    const trackingToken = randomToken();
    const db = getDb();
    await db.batch([
      db.insert(orders).values({ ...orderData, notes: storedNotes, id, orderNumber, trackingToken, status: "received", createdAt: now, updatedAt: now }),
      db.insert(orderEvents).values({ id: crypto.randomUUID(), orderId: id, status: "received", publicNote: data.locale === "tr" ? "Sipariş talebiniz ekibimize ulaştı." : "Your request has reached our team.", createdAt: now }),
    ]);
    const notification = await notifyNewOrder({
      orderNumber,
      trackingToken,
      locale: data.locale,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      productType: data.productType,
      woodType: data.woodType,
      epoxy: data.epoxy,
      legStyle: data.legStyle,
      dimensions: data.dimensions,
      finish: data.finish,
      notes: data.notes,
      upholstery,
      quantity,
    }).catch(() => ({ sent: false, reason: "failed", adminSent: false, customerSent: false }));
    await db.update(orders).set({ notificationStatus: notification.sent ? "sent" : notification.reason }).where((await import("drizzle-orm")).eq(orders.id, id));
    return NextResponse.json({ orderNumber, trackingToken, status: "received", customerEmailSent: notification.customerSent }, { status: 201 });
  } catch (error) {
    console.error("order-create", error);
    return NextResponse.json({ error: "order-create-failed" }, { status: 500 });
  }
}
