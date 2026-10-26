import type { MetadataRoute } from "next";
import { getCatalog, getFurnitureCategories } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

const origin = "https://woodenuniverse.com";

function localizedEntries(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = { tr: `${origin}/tr${path}`, en: `${origin}/en${path}` };
  return (["tr", "en"] as const).map((locale) => ({
    url: languages[locale],
    alternates: { languages },
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getFurnitureCategories(), getCatalog("products")]);
  const mainPaths = ["", "/products", "/chairs", "/sets", "/woods", "/projects", "/workshop", "/about", "/contact", "/faq"];

  return [
    ...mainPaths.flatMap((path) => localizedEntries(path, path === "" ? 1 : 0.7)),
    ...categories.flatMap((category) => localizedEntries(`/products/category/${category.id}`, 0.8)),
    ...products.flatMap((product) => localizedEntries(`/products/${product.id}`, 0.6)),
  ];
}
