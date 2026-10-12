import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";
import { getAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ media: await getDb().select().from(media).orderBy(desc(media.createdAt)).limit(200) });
}

export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!env.BUCKET) return NextResponse.json({ error: "storage-unavailable" }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > 8_000_000 || !file.type.startsWith("image/")) return NextResponse.json({ error: "invalid-file" }, { status: 400 });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(-120);
  const key = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  const row = { id: crypto.randomUUID(), key, filename: file.name, mimeType: file.type, altTr: String(form.get("altTr") ?? ""), altEn: String(form.get("altEn") ?? ""), createdAt: new Date().toISOString() };
  await getDb().insert(media).values(row);
  return NextResponse.json({ ...row, url: `/api/media/${key}` }, { status: 201 });
}
