import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { CatalogLookbook } from "@/components/catalog-lookbook";
import { isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata(
    locale,
    locale === "tr" ? "Masa ve Sandalye Setleri" : "Table and Chair Sets",
    locale === "tr"
      ? "Ev, kafe, restoran ve oteller için masa ve sandalye setleri. Mekânınıza uygun ölçü, sandalye modeli ve malzemeyle özel teklif oluşturun."
      : "Table and chair sets for homes, cafes, restaurants and hotels. Choose dimensions, seating and materials for your space.",
    "/sets",
  );
}

export default async function SetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const content = await resolveContent(locale, {
    "sets.title": tr ? "Birlikte tasarlanan bütünlük." : "A complete composition, designed together.",
    "sets.body": tr ? "Kafe, restoran, otel ve ev projeleri için masa ölçüsü ile sandalye modelini birlikte seçin." : "Pair table dimensions and chair models for cafe, restaurant, hotel and residential projects.",
  });
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={tr ? "MASA VE SANDALYE SETLERİ" : "TABLE & CHAIR SETS"} title={content["sets.title"]} lead={content["sets.body"]} image="/images/catalog/lookbook/sets/page-01.webp" index="SETS / 12" />
    <CatalogLookbook locale={locale} section="sets" pageCount={12} />
    <InquiryBand locale={locale} title={tr ? "Mekân planını ve adet ihtiyacını paylaşın; uygun seti birlikte kuralım." : "Share the floor plan and quantity to build the right set together."} />
  </InnerShell>;
}
