import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { RevealHeading3D } from "@/components/editorial-motion";
import { isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { getCatalog } from "@/lib/catalog-store";

export default async function ChairsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const chairModels = await getCatalog("chairs");
  const content = await resolveContent(locale, {
    "chairs.title": tr ? "Oturmanın biçimi, mekânın karakteri." : "The form of seating, the character of a space.",
    "chairs.body": tr ? "33 sandalye ve bar sandalyesi modeli; yeni malzeme, renk ve proje seçenekleriyle Wooden Universe koleksiyonunda." : "Thirty-three chair and bar-chair models, now in the Wooden Universe collection with new material, color and project options.",
    "chairs.image": "/images/catalog/chairs/page-02.jpg",
  });
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow="WOODEN UNIVERSE SEATING" title={content["chairs.title"]} lead={content["chairs.body"]} image={content["chairs.image"]} index={`SEATING / ${chairModels.length}`} />
    <section className="collection-manifesto"><div className="blur-reveal"><p className="eyebrow">{chairModels.length} {tr ? "MODEL" : "MODELS"}</p><RevealHeading3D as="h2">{tr ? "Restorandan eve, tek sandalyeden bütün projeye." : "From restaurant to home, from one chair to an entire project."}</RevealHeading3D></div><p className="blur-reveal">{tr ? "Ahşap rengi, döşeme ve adet seçenekleri proje sırasında kesinleştirilir. Katalogdaki modeller fiyat yerine talep üzerinden çalışır." : "Wood color, upholstery and quantity are confirmed during the project. Collection models are handled by request rather than online pricing."}</p></section>
    <section className="model-catalog-grid">{chairModels.map((model) => <article className="model-card blur-reveal" key={model.id}><a href={`/${locale}/chairs/${model.id}`}><div className="model-card-image"><img src={model.image} alt={model.name} /><span>{String(model.index).padStart(2, "0")}</span></div><div className="model-card-copy"><small>{model.type[locale]}</small><h2>{model.name}</h2><p>{model.description[locale]}</p><span className="model-link">{tr ? "Modeli incele" : "View model"}<ArrowUpRight /></span></div></a></article>)}</section>
    <InquiryBand locale={locale} title={tr ? "Model, renk, döşeme ve adet bilgisini paylaşın; proje teklifini hazırlayalım." : "Share the model, color, upholstery and quantity for a project quote."} />
  </InnerShell>;
}
