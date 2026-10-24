import { SiteImage } from "@/components/site-image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { RevealHeading3D } from "@/components/editorial-motion";
import { localized } from "@/lib/collection-data";
import { isLocale } from "@/lib/catalog";
import { getCatalog, getFurnitureCategories } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

export default async function FurnitureCategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale: rawLocale, category } = await params;
  if (!isLocale(rawLocale)) notFound();
  const furnitureCategories = await getFurnitureCategories();
  const item = furnitureCategories.find((entry) => entry.id === category);
  if (!item) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const products = await getCatalog("products");
  const examples = products.filter((product) => product.category === category || (category === "tables" && product.categoryTr.includes("Masa")));
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={localized(item.eyebrow, locale)} title={localized(item.title, locale)} lead={localized(item.description, locale)} image={item.image} index="FURNITURE / WU" />
    <section className="category-statement"><div className="blur-reveal"><p className="eyebrow">{tr ? "ÖLÇÜYE GÖRE" : "MADE TO MEASURE"}</p><RevealHeading3D as="h2">{tr ? "Hazır kalıp değil, mekânla birlikte çizilen bir parça." : "Not a fixed template, but a piece drawn with the space."}</RevealHeading3D></div><p className="blur-reveal">{tr ? "Ölçü, depolama ihtiyacı, ağaç, yüzey ve metal detaylar teklif öncesinde birlikte belirlenir. Sitede ödeme alınmaz; talebiniz atölye tarafından incelenir." : "Dimensions, storage, wood, finish and metal details are defined together before quotation. No payment is taken online; the workshop reviews your request."}</p></section>
    {item.gallery && item.gallery.length > 1 && <section className="category-gallery-section"><div className="category-gallery-heading blur-reveal"><div><p className="eyebrow">{tr ? "TÜM GÖRSELLER" : "ALL VIEWS"}</p><RevealHeading3D as="h2">{tr ? `${localized(item.title, locale)} farklı açılardan.` : `${localized(item.title, locale)} from every angle.`}</RevealHeading3D></div><p>{tr ? `${item.gallery.length} farklı görünümün tamamını aşağıda inceleyebilirsiniz.` : `Explore all ${item.gallery.length} views below.`}</p></div><div className="category-gallery-grid">{item.gallery.map((image, index) => <a className="category-gallery-item blur-reveal" href={image} target="_blank" rel="noreferrer" key={image}><SiteImage src={image} alt={`${localized(item.title, locale)} ${index + 1}`} /><span>{String(index + 1).padStart(2, "0")} / {String(item.gallery?.length ?? 0).padStart(2, "0")}</span></a>)}</div></section>}
    {examples.length > 0 && <section className="related-section"><p className="eyebrow">{tr ? "ATÖLYEDEN ÖRNEKLER" : "WORKSHOP REFERENCES"}</p><div className="related-grid">{examples.map((product) => <a href={`/${locale}/products/${product.id}`} key={product.id}><SiteImage src={product.image} position={product.imagePosition} mobilePosition={product.mobileImagePosition} alt={tr ? product.nameTr : product.nameEn} /><h3>{tr ? product.nameTr : product.nameEn}</h3><span>{product.dimensions}</span></a>)}</div></section>}
    <div className="detail-back"><a href={`/${locale}/products`}><ArrowLeft />{tr ? "Tüm mobilyalar" : "All furniture"}</a><a href={`/${locale}/design?type=${item.id}`}>{tr ? "Bu kategori için talep oluştur" : "Create a request for this category"}<ArrowUpRight /></a></div>
    <InquiryBand locale={locale} title={tr ? `${localized(item.title, locale)} için ölçünüzü ve ihtiyacınızı paylaşın.` : `Share your dimensions and brief for ${localized(item.title, locale)}.`} />
  </InnerShell>;
}
