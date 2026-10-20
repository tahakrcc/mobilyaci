import { SiteImage } from "@/components/site-image";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { RevealHeading3D } from "@/components/editorial-motion";
import { isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { getCatalog } from "@/lib/catalog-store";

export default async function SetsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const setModels = await getCatalog("sets");
  const content = await resolveContent(locale, {
    "sets.title": tr ? "Birlikte tasarlanan bütünlük." : "A complete composition, designed together.",
    "sets.body": tr ? "Kafe, restoran, otel ve ev projeleri için masa ölçüsü ile sandalye modelini birlikte seçin." : "Pair table dimensions and chair models for cafe, restaurant, hotel and residential projects.",
    "sets.image": "/images/catalog/sets/page-35.webp",
  });
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={tr ? "MASA VE SANDALYE SETLERİ" : "TABLE & CHAIR SETS"} title={content["sets.title"]} lead={content["sets.body"]} image={content["sets.image"]} index={`SETS / ${setModels.length}`} />
    <section className="collection-manifesto"><div className="blur-reveal"><p className="eyebrow">{setModels.length} {tr ? "SET KONFİGÜRASYONU" : "SET CONFIGURATIONS"}</p><RevealHeading3D as="h2">{tr ? "Kompakt kafe masasından altı kişilik yemek setine." : "From compact cafe tables to six-seat dining sets."}</RevealHeading3D></div><p className="blur-reveal">{tr ? "Tabla, ayak, ahşap rengi ve sandalye döşemesi proje bütünlüğüne göre eşleştirilir." : "Top, base, wood color and chair upholstery are coordinated around the complete project."}</p></section>
    <section className="set-catalog-grid">{setModels.map((model, index) => {
      const splitCrop = model.imagePosition === "center 20%" ? " crop-top" : model.imagePosition === "center 80%" ? " crop-bottom" : "";
      return <article className="set-card blur-reveal" key={model.id}><a href={`/${locale}/sets/${model.id}`}><div className={`set-card-image${splitCrop}`}><SiteImage src={model.image} position={model.imagePosition} mobilePosition={model.mobileImagePosition} alt={model.name} /></div><div className="set-card-copy"><span>{String(index + 1).padStart(2, "0")} / {String(setModels.length).padStart(2, "0")}</span><small>{model.kind[locale]}</small><h2>{model.name}</h2><p>{model.sizes} · {model.capacity[locale]}</p><b>{tr ? "Seti incele" : "View set"}<ArrowUpRight /></b></div></a></article>;
    })}</section>
    <InquiryBand locale={locale} title={tr ? "Mekân planını ve adet ihtiyacını paylaşın; uygun seti birlikte kuralım." : "Share the floor plan and quantity to build the right set together."} />
  </InnerShell>;
}
