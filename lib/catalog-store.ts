import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { products, type Product } from "@/lib/catalog";
import { chairModels, setModels, type ChairModel, type SetModel } from "@/lib/collection-data";

export type CatalogKind = "products" | "chairs" | "sets";
export type CatalogMap = { products: Product[]; chairs: ChairModel[]; sets: SetModel[] };

const defaults: CatalogMap = { products, chairs: chairModels, sets: setModels };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validItems<K extends CatalogKind>(kind: K, value: unknown): CatalogMap[K] | null {
  if (!Array.isArray(value) || !value.every((item) => isRecord(item) && typeof item.id === "string" && typeof item.image === "string")) return null;
  if (kind === "products" && !value.every((item) => typeof item.nameTr === "string" && typeof item.nameEn === "string")) return null;
  if (kind !== "products" && !value.every((item) => typeof item.name === "string")) return null;
  return value as CatalogMap[K];
}

export async function getCatalog<K extends CatalogKind>(kind: K, includeInactive = false): Promise<CatalogMap[K]> {
  let items = defaults[kind];
  try {
    const [row] = await getDb().select().from(siteContent).where(and(eq(siteContent.key, `catalog.${kind}`), eq(siteContent.locale, "shared"))).limit(1);
    if (row) {
      const parsed = validItems(kind, JSON.parse(row.value));
      if (parsed) items = parsed;
    }
  } catch {
    // The curated defaults keep public pages available during database outages.
  }
  if (includeInactive) return items as CatalogMap[K];
  const visible = items.filter((item) => item.active !== false);
  return (visible.length ? visible : defaults[kind].filter((item) => item.active !== false)) as CatalogMap[K];
}

export async function saveCatalog<K extends CatalogKind>(kind: K, items: CatalogMap[K]) {
  const db = getDb();
  const where = and(eq(siteContent.key, `catalog.${kind}`), eq(siteContent.locale, "shared"));
  const [existing] = await db.select().from(siteContent).where(where).limit(1);
  const value = JSON.stringify(items);
  const updatedAt = new Date().toISOString();
  if (existing) await db.update(siteContent).set({ value, type: "json", updatedAt }).where(eq(siteContent.id, existing.id));
  else await db.insert(siteContent).values({ id: crypto.randomUUID(), key: `catalog.${kind}`, locale: "shared", type: "json", value, updatedAt });
}
