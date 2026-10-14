import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const [object] = await getDb().select({ url: media.url }).from(media).where(eq(media.key, key.join("/"))).limit(1);
  if (!object) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.redirect(object.url, 307);
}
