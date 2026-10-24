import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { products, type Product } from "@/lib/catalog";
import { chairModels, furnitureCategories, setModels, type ChairModel, type FurnitureCategory, type SetModel } from "@/lib/collection-data";

export type CatalogKind = "products" | "chairs" | "sets";
export type CatalogMap = { products: Product[]; chairs: ChairModel[]; sets: SetModel[] };

const defaults: CatalogMap = { products, chairs: chairModels, sets: setModels };

function normalizeLegacySets(items: SetModel[]) {
  const curatedById = new Map(setModels.map((item) => [item.id, item]));
  return items.map((item) => {
    const curated = curatedById.get(item.id);
    if (!curated || !/^\/images\/catalog\/sets\/page-\d+\.webp$/.test(item.image)) return item;
    return { ...item, image: curated.image, imagePosition: curated.imagePosition, mobileImagePosition: curated.mobileImagePosition };
  });
}

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
  if (kind === "sets") items = normalizeLegacySets(items as SetModel[]) as CatalogMap[K];
  if (includeInactive) return items as CatalogMap[K];
  const visible = items.filter((item) => item.active !== false);
  return (visible.length ? visible : defaults[kind].filter((item) => item.active !== false)) as CatalogMap[K];
}

function validFurnitureCategoryList(value: unknown): FurnitureCategory[] | null {
  if (!Array.isArray(value) || !value.every((item) =>
    isRecord(item)
    && typeof item.id === "string"
    && typeof item.image === "string"
    && isRecord(item.title)
    && typeof item.title.tr === "string"
    && typeof item.title.en === "string"
    && isRecord(item.eyebrow)
    && typeof item.eyebrow.tr === "string"
    && typeof item.eyebrow.en === "string"
    && isRecord(item.description)
    && typeof item.description.tr === "string"
    && typeof item.description.en === "string"
    && (item.gallery === undefined || (Array.isArray(item.gallery) && item.gallery.every((image) => typeof image === "string")))
  )) return null;
  return value as FurnitureCategory[];
}

export async function getFurnitureCategories(): Promise<FurnitureCategory[]> {
  try {
    const [row] = await getDb().select().from(siteContent).where(and(eq(siteContent.key, "catalog.furniture-categories"), eq(siteContent.locale, "shared"))).limit(1);
    if (row) {
      const raw: unknown = JSON.parse(row.value);
      const complete = validFurnitureCategoryList(raw);
      if (complete?.length) return complete;
      if (isRecord(raw)) {
        const overrides = validFurnitureCategoryList(raw.overrides) ?? [];
        const additions = validFurnitureCategoryList(raw.additions) ?? [];
        const overrideById = new Map(overrides.map((item) => [item.id, item]));
        const merged = furnitureCategories.map((item) => overrideById.get(item.id) ?? item);
        const existingIds = new Set(merged.map((item) => item.id));
        for (const addition of additions) {
          if (existingIds.has(addition.id)) continue;
          const insertAfter = addition.id === "solid-slab-tables" ? merged.findIndex((item) => item.id === "coffee-tables") : -1;
          merged.splice(insertAfter >= 0 ? insertAfter + 1 : merged.length, 0, addition);
          existingIds.add(addition.id);
        }
        if (overrides.length || additions.length) return merged;
      }
    }
  } catch {
    // Curated local data keeps the site available if storage is temporarily unavailable.
  }
  return furnitureCategories;
}

export async function getSharedAssetUrl(key: string, fallback: string): Promise<string> {
  try {
    const [row] = await getDb().select({ value: siteContent.value }).from(siteContent).where(and(eq(siteContent.key, key), eq(siteContent.locale, "shared"))).limit(1);
    if (row?.value && (/^https:\/\//.test(row.value) || row.value.startsWith("/"))) return row.value;
  } catch {
    // A local fallback prevents a transient database issue from breaking the experience.
  }
  return fallback;
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
