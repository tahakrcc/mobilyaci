import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { getAdmin } from "@/lib/admin-auth";

const schema = z.object({ key: z.string().regex(/^[a-z0-9._-]+$/).max(100), locale: z.enum(["tr", "en"]), type: z.enum(["text", "textarea", "image"]).default("text"), value: z.string().max(10000) });

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ content: await getDb().select().from(siteContent) });
}

export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-content" }, { status: 400 });
  const db = getDb();
  const where = and(eq(siteContent.key, parsed.data.key), eq(siteContent.locale, parsed.data.locale));
  const [existing] = await db.select().from(siteContent).where(where).limit(1);
  if (existing) await db.update(siteContent).set({ type: parsed.data.type, value: parsed.data.value, updatedAt: new Date().toISOString() }).where(eq(siteContent.id, existing.id));
  else await db.insert(siteContent).values({ id: crypto.randomUUID(), ...parsed.data, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
