import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin } from "@/lib/admin-auth";
import { getCatalog, saveCatalog, type CatalogKind, type CatalogMap } from "@/lib/catalog-store";

const kindSchema = z.enum(["products", "chairs", "sets"]);
const itemSchema = z.object({ id: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/), image: z.string().min(1).max(2000), active: z.boolean().optional() }).passthrough();
const bodySchema = z.object({ kind: kindSchema, items: z.array(itemSchema).max(500) });

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [products, chairs, sets] = await Promise.all([getCatalog("products", true), getCatalog("chairs", true), getCatalog("sets", true)]);
  return NextResponse.json({ products, chairs, sets });
}

export async function PUT(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid-catalog", details: parsed.error.flatten() }, { status: 400 });
  const { kind, items } = parsed.data;
  await saveCatalog(kind, items as CatalogMap[CatalogKind]);
  return NextResponse.json({ ok: true, count: items.length });
}
