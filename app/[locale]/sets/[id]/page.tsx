import { SiteImage } from "@/components/site-image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { getCatalog } from "@/lib/catalog-store";

export default async function SetDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const model = (await getCatalog("sets")).find((item) => item.id === id);
  if (!model) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={model.kind[locale]} title={model.name} lead={tr ? "Masa ölçüsü, sandalye adedi, ahşap rengi ve döşeme proje için birlikte kesinleştirilir." : "Table size, chair quantity, wood color and upholstery are confirmed together for the project."} image={model.image} index="SETS / WU" />
    <section className="detail-intro"><div className="detail-statement blur-reveal"><p className="eyebrow">{tr ? "SET BİLGİSİ" : "SET INFORMATION"}</p><h2>{tr ? "Tek ürün değil, uyumlu bir mekân çözümü." : "Not a single product, but a coordinated spatial solution."}</h2></div><dl className="detail-facts blur-reveal"><div><dt>{tr ? "Model" : "Model"}</dt><dd>{model.name}</dd></div><div><dt>{tr ? "Tür" : "Type"}</dt><dd>{model.kind[locale]}</dd></div><div><dt>{tr ? "Masa ölçüleri" : "Table sizes"}</dt><dd>{model.sizes}</dd></div><div><dt>{tr ? "Kapasite" : "Capacity"}</dt><dd>{model.capacity[locale]}</dd></div></dl></section>
    <section className="catalog-spread"><SiteImage src={model.image} position={model.imagePosition} mobilePosition={model.mobileImagePosition} alt={`${model.name} ${tr ? "katalog sayfası" : "catalogue page"}`} /><div><span>WU / CONTRACT</span><p>{tr ? "Adet, teslim yeri ve malzeme seçenekleri teklif aşamasında netleşir. İnternet üzerinden ödeme alınmaz." : "Quantity, delivery location and material options are confirmed at quotation. No online payment is taken."}</p></div></section>
    {!!model.gallery?.length && <section className="managed-gallery">{model.gallery.map((image, index) => <SiteImage src={image} alt={`${model.name} ${index + 1}`} key={image} />)}</section>}
    <div className="detail-back"><a href={`/${locale}/sets`}><ArrowLeft />{tr ? "Tüm setler" : "All sets"}</a><a href={`/${locale}/design?type=set&model=${model.id}`}>{tr ? "Bu set için talep oluştur" : "Request this set"}<ArrowUpRight /></a></div>
    <InquiryBand locale={locale} />
  </InnerShell>;
}
