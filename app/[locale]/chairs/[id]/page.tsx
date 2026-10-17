import { SiteImage } from "@/components/site-image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalog-store";

export default async function ChairDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const model = (await getCatalog("chairs")).find((item) => item.id === id);
  if (!model) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={model.type[locale]} title={model.name} lead={model.description[locale]} image={model.image} index={`SEATING / ${String(model.index).padStart(2, "0")}`} />
    <section className="detail-intro"><div className="detail-statement blur-reveal"><p className="eyebrow">{tr ? "PROJEYE GÖRE" : "PROJECT OPTIONS"}</p><h2>{tr ? "Renk, döşeme ve adet birlikte belirlenir." : "Color, upholstery and quantity are defined together."}</h2></div><dl className="detail-facts blur-reveal"><div><dt>{tr ? "Model" : "Model"}</dt><dd>{model.name}</dd></div><div><dt>{tr ? "Kategori" : "Category"}</dt><dd>{model.type[locale]}</dd></div><div><dt>{tr ? "Ahşap renkleri" : "Wood colors"}</dt><dd>{model.colors.join(" · ")}</dd></div><div><dt>{tr ? "Sipariş" : "Order"}</dt><dd>{tr ? "Teklif talebiyle" : "By quote request"}</dd></div></dl></section>
    <section className="catalog-spread"><SiteImage src={model.image} position={model.imagePosition} mobilePosition={model.mobileImagePosition} alt={`${model.name} ${tr ? "katalog sayfası" : "catalogue page"}`} /><div><span>WU / SEATING</span><p>{tr ? "Katalogdaki görünüm referanstır. Güncel ahşap, kumaş ve termin seçenekleri teklif sırasında paylaşılır." : "The catalogue view is a reference. Current wood, fabric and lead-time options are shared with the quote."}</p></div></section>
    {!!model.gallery?.length && <section className="managed-gallery">{model.gallery.map((image, index) => <SiteImage src={image} alt={`${model.name} ${index + 1}`} key={image} />)}</section>}
    <div className="detail-back"><a href={`/${locale}/chairs`}><ArrowLeft />{tr ? "Tüm sandalyeler" : "All chairs"}</a><a href={`/${locale}/design?type=chair&model=${model.id}`}>{tr ? "Bu model için talep oluştur" : "Request this model"}<ArrowUpRight /></a></div>
    <InquiryBand locale={locale} />
  </InnerShell>;
}
