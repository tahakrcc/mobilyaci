import { SiteImage } from "@/components/site-image";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealHeading3D, RibbonType, ScrollRevealController } from "@/components/editorial-motion";
import { furnitureCategories, localized } from "@/lib/collection-data";
import { isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { getCatalog } from "@/lib/catalog-store";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const products = await getCatalog("products");
  const content = await resolveContent(locale, {
    "furniture.title": tr ? "Mekâna göre çizilen, malzemeye göre biçimlenen." : "Drawn for the space, shaped by the material.",
    "furniture.body": tr ? "TV ünitesinden tek parça masaya; her çalışma ölçü, kullanım ve gerçek malzemeye göre yeniden tasarlanır." : "From TV units to one-of-one tables, every piece is redrawn around dimensions, use and real material.",
  });
  return <main className="public-site catalog-page furniture-hub">
    <ScrollRevealController />
    <SiteHeader locale={locale} />
    <header className="page-hero collection-hero">
      <p className="eyebrow blur-reveal">{tr ? "WOODEN UNIVERSE MOBİLYA" : "WOODEN UNIVERSE FURNITURE"}</p>
      <RevealHeading3D as="h1">{content["furniture.title"]}</RevealHeading3D>
      <p className="blur-reveal collection-hero-note">{content["furniture.body"]}</p>
    </header>
    <section className="priority-collections">
      <div className="section-heading blur-reveal"><div><p className="eyebrow">{tr ? "ÖNCELİKLİ KOLEKSİYON" : "PRIORITY COLLECTION"}</p><h2>{tr ? "Yaşam alanının ana parçaları." : "The defining pieces of a space."}</h2></div><p>{tr ? "TV ünitesi, konsol ve kahve köşesi için mekân ölçüsüne dayalı özel üretim." : "Bespoke TV units, consoles and coffee corners based on the dimensions of the space."}</p></div>
      <div className="priority-grid">{furnitureCategories.filter((item) => item.priority).map((item, index) => <a className="priority-card blur-reveal" href={`/${locale}/products/category/${item.id}`} key={item.id}><SiteImage src={item.image} alt={localized(item.title, locale)} /><span>0{index + 1}</span><div><small>{localized(item.eyebrow, locale)}</small><h3>{localized(item.title, locale)}</h3><p>{localized(item.description, locale)}</p><ArrowUpRight /></div></a>)}</div>
    </section>
    <section className="furniture-category-list">
      <p className="eyebrow blur-reveal">{tr ? "TÜM MOBİLYALAR" : "ALL FURNITURE"}</p>
      {furnitureCategories.map((item, index) => <a className="furniture-category-row blur-reveal" href={`/${locale}/products/category/${item.id}`} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{localized(item.eyebrow, locale)}</small><h2>{localized(item.title, locale)}</h2><p>{localized(item.description, locale)}</p></div><SiteImage src={item.image} alt="" /><ArrowUpRight /></a>)}
    </section>
    <section className="catalog-realized">
      <div className="section-heading blur-reveal"><div><p className="eyebrow">{tr ? "GERÇEKLEŞEN PARÇALAR" : "REALIZED PIECES"}</p><h2>{tr ? "Atölyeden çıkan seçilmiş işler." : "Selected work from the workshop."}</h2></div></div>
      <div className="catalog-grid">{products.map((product, index) => <article className="catalog-card blur-reveal" key={product.id}><a className="catalog-image-link" href={`/${locale}/products/${product.id}`}><SiteImage src={product.image} position={product.imagePosition} mobilePosition={product.mobileImagePosition} alt={tr ? product.nameTr : product.nameEn} /><span>{String(index + 1).padStart(2, "0")}</span></a><div className="catalog-card-copy"><small>{tr ? product.categoryTr : product.categoryEn}</small><h2><a href={`/${locale}/products/${product.id}`}>{tr ? product.nameTr : product.nameEn}</a></h2><p>{tr ? product.epoxyTr : product.epoxyEn}<br />{product.dimensions}</p><div className="catalog-actions"><a className="text-link" href={`/${locale}/products/${product.id}`}>{tr ? "Detayları gör" : "View details"}</a><a className="button dark" href={`/${locale}/design?product=${product.id}`}>{tr ? "Talep oluştur" : "Create request"}<ArrowUpRight /></a></div></div></article>)}</div>
    </section>
    <RibbonType locale={locale} />
    <SiteFooter locale={locale} />
  </main>;
}
