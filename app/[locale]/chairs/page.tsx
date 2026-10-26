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
    locale === "tr" ? "Sandalye ve Bar Sandalyesi Modelleri" : "Chair and Bar Stool Models",
    locale === "tr"
      ? "Ev, kafe, restoran ve otel projeleri için sandalye ve bar sandalyesi modellerini inceleyin; renk, döşeme ve adet seçenekleriyle teklif isteyin."
      : "Explore chair and bar stool models for homes, cafes, restaurants and hotels, with color, upholstery and quantity options.",
    "/chairs",
  );
}

export default async function ChairsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const content = await resolveContent(locale, {
    "chairs.title": tr ? "Oturmanın biçimi, mekânın karakteri." : "The form of seating, the character of a space.",
    "chairs.body": tr ? "33 sandalye ve bar sandalyesi modeli; yeni malzeme, renk ve proje seçenekleriyle Wooden Universe koleksiyonunda." : "Thirty-three chair and bar-chair models, now in the Wooden Universe collection with new material, color and project options.",
  });
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow="WOODEN UNIVERSE SEATING" title={content["chairs.title"]} lead={content["chairs.body"]} image="/images/catalog/lookbook/chairs/page-01.webp" index="SEATING / 25" />
    <CatalogLookbook locale={locale} section="chairs" pageCount={25} />
    <InquiryBand locale={locale} title={tr ? "Model, renk, döşeme ve adet bilgisini paylaşın; proje teklifini hazırlayalım." : "Share the model, color, upholstery and quantity for a project quote."} />
  </InnerShell>;
}
