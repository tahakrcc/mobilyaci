import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import type { Locale } from "@/lib/catalog";

export async function resolveContent(locale: Locale, defaults: Record<string, string>) {
  try {
    const keys = Object.keys(defaults);
    if (!keys.length) return defaults;
    const rows = await getDb().select().from(siteContent).where(and(eq(siteContent.locale, locale), inArray(siteContent.key, keys)));
    return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), { ...defaults });
  } catch {
    return defaults;
  }
}
