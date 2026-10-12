import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { orderEvents, orders } from "@/db/schema";

const schema = z.object({ orderNumber: z.string().trim().min(6).max(40), email: z.string().email().max(180), trackingToken: z.string().max(80).optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-query" }, { status: 400 });
  const db = getDb();
  const [order] = await db.select().from(orders).where(and(eq(orders.orderNumber, parsed.data.orderNumber.toUpperCase()), eq(orders.email, parsed.data.email.toLowerCase()))).limit(1);
  if (!order || (parsed.data.trackingToken && parsed.data.trackingToken !== order.trackingToken)) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const events = await db.select({ id: orderEvents.id, status: orderEvents.status, publicNote: orderEvents.publicNote, mediaUrl: orderEvents.mediaUrl, createdAt: orderEvents.createdAt }).from(orderEvents).where(eq(orderEvents.orderId, order.id)).orderBy(asc(orderEvents.createdAt));
  return NextResponse.json({ order: { orderNumber: order.orderNumber, status: order.status, productType: order.productType, woodType: order.woodType, epoxy: order.epoxy, dimensions: order.dimensions, estimatedDelivery: order.estimatedDelivery, createdAt: order.createdAt }, events });
}
