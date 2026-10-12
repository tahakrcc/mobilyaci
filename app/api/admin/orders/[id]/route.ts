import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { orderEvents, orders } from "@/db/schema";
import { orderStatuses } from "@/lib/catalog";
import { getAdmin } from "@/lib/admin-auth";

const schema = z.object({ status: z.string().refine((value) => orderStatuses.some((item) => item.id === value)), publicNote: z.string().max(1000).default(""), internalNote: z.string().max(1000).default(""), estimatedDelivery: z.string().max(40).optional().nullable(), quotedAmount: z.number().int().nonnegative().optional().nullable(), mediaUrl: z.string().url().max(500).optional().nullable() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-update" }, { status: 400 });
  const { id } = await context.params;
  const now = new Date().toISOString();
  const db = getDb();
  await db.batch([
    db.update(orders).set({ status: parsed.data.status, estimatedDelivery: parsed.data.estimatedDelivery, quotedAmount: parsed.data.quotedAmount, updatedAt: now }).where(eq(orders.id, id)),
    db.insert(orderEvents).values({ id: crypto.randomUUID(), orderId: id, status: parsed.data.status, publicNote: parsed.data.publicNote, internalNote: parsed.data.internalNote, mediaUrl: parsed.data.mediaUrl, createdAt: now }),
  ]);
  return NextResponse.json({ ok: true });
}
