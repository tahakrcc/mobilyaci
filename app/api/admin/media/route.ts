import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { desc, eq, like } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { media, siteContent } from "@/db/schema";
import { getAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ media: await getDb().select().from(media).orderBy(desc(media.createdAt)).limit(200) });
}

export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!(file instanceof File) || file.size === 0 || file.size > 4_000_000 || !allowedTypes.has(file.type)) return NextResponse.json({ error: "invalid-file" }, { status: 400 });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(-120);
  const key = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
  const blob = await put(key, file, { access: "public", addRandomSuffix: false });
  const row = { id: crypto.randomUUID(), key: blob.pathname, url: blob.url, filename: file.name, mimeType: file.type, altTr: String(form.get("altTr") ?? ""), altEn: String(form.get("altEn") ?? ""), createdAt: new Date().toISOString() };
  await getDb().insert(media).values(row);
  return NextResponse.json(row, { status: 201 });
}

const updateSchema = z.object({ id: z.string().uuid(), altTr: z.string().max(300), altEn: z.string().max(300) });

export async function PATCH(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-media" }, { status: 400 });
  const [updated] = await getDb().update(media).set({ altTr: parsed.data.altTr.trim(), altEn: parsed.data.altEn.trim() }).where(eq(media.id, parsed.data.id)).returning();
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: "not-found" }, { status: 404 });
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = deleteSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-media" }, { status: 400 });
  const [item] = await getDb().select().from(media).where(eq(media.id, parsed.data.id)).limit(1);
  if (!item) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const catalogRows = await getDb().select({ value: siteContent.value }).from(siteContent).where(like(siteContent.key, "catalog.%"));
  if (catalogRows.some((row) => row.value.includes(item.url))) return NextResponse.json({ error: "in-use" }, { status: 409 });
  await del(item.url);
  await getDb().delete(media).where(eq(media.id, item.id));
  return NextResponse.json({ ok: true });
}
