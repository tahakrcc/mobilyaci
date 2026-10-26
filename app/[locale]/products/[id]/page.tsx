import { SiteImage } from "@/components/site-image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale, trees } from "@/lib/catalog";
import { treeProfiles } from "@/lib/site-content";
import { getCatalog } from "@/lib/catalog-store";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const product = (await getCatalog("products")).find((item) => item.id === id);
  if (!product) notFound();
  const title = locale === "tr" ? product.nameTr : product.nameEn;
  return pageMetadata(
    locale,
    title,
    locale === "tr"
      ? `${title}: ${product.categoryTr.toLowerCase()} için ahşap, epoksi ve özel ölçü seçeneklerini inceleyin. WoodenUniverse atölyesinden kişisel tasarım talep edin.`
      : `Explore the wood, resin and custom dimension options for ${title}. Request a bespoke piece from the WoodenUniverse workshop.`,
    `/products/${id}`,
    product.image,
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const product = (await getCatalog("products")).find((item) => item.id === id);
  if (!product) notFound();
  const locale = rawLocale; const tr = locale === "tr";
  const tree = trees.find((item) => item.id === product.wood)!;
  const profile = treeProfiles[product.wood as keyof typeof treeProfiles];
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={tr ? product.categoryTr : product.categoryEn} title={tr ? product.nameTr : product.nameEn} lead={tr ? "Bu çalışma bir katalog ürünü değil; ölçü, damar ve mekâna göre yeniden yorumlanan bir başlangıç noktasıdır." : "This is not a catalogue product, but a starting point reinterpreted for dimension, grain and place."} image={product.image} index="COLLECTION / 01" />
    <section className="detail-intro">
      <div className="detail-statement blur-reveal"><p className="eyebrow">{tr ? "MALZEME KARAKTERİ" : "MATERIAL CHARACTER"}</p><h2>{profile.lead[locale]}</h2></div>
      <dl className="detail-facts blur-reveal"><div><dt>{tr ? "Ağaç" : "Wood"}</dt><dd>{tr ? tree.tr : tree.en}</dd></div><div><dt>{tr ? "Epoksi" : "Resin"}</dt><dd>{tr ? product.epoxyTr : product.epoxyEn}</dd></div><div><dt>{tr ? "Referans ölçü" : "Reference size"}</dt><dd>{product.dimensions}</dd></div><div><dt>{tr ? "Üretim" : "Production"}</dt><dd>{tr ? "Siparişe özel · tek parça" : "Made to order · one of one"}</dd></div></dl>
    </section>
    <section className="detail-gallery"><SiteImage src={product.image} position={product.imagePosition} mobilePosition={product.mobileImagePosition} alt={tr ? product.nameTr : product.nameEn} /><div className="detail-gallery-note"><span>01 / 02</span><p>{tr ? "Gerçek plakanın damar sınırları tasarımın nihai çizgisini belirler." : "The grain boundaries of the actual slab determine the final line of the design."}</p></div></section>
    {!!product.gallery?.length && <section className="managed-gallery">{product.gallery.map((image, index) => <SiteImage src={image} alt={`${tr ? product.nameTr : product.nameEn} ${index + 1}`} key={image} />)}</section>}
    <section className="detail-copy-grid"><article className="blur-reveal"><p className="eyebrow">{tr ? "YAKLAŞIM" : "APPROACH"}</p><h2>{tr ? "Form, ağacı düzeltmek için değil; onu görünür kılmak için kurulur." : "The form is built not to correct the wood, but to make it visible."}</h2></article><article className="blur-reveal"><h3>{tr ? "Size göre yeniden çizilir" : "Redrawn for you"}</h3><p>{tr ? "Masa yüksekliği, kullanım alanı, kenar karakteri, ayak sistemi ve epoksi tonu birlikte belirlenir. Fotoğraftaki çalışma birebir çoğaltılmaz." : "Height, use, edge character, base and resin tone are decided together. The photographed work is never copied exactly."}</p><h3>{tr ? "Bakım" : "Care"}</h3><p>{tr ? "Yumuşak ve hafif nemli bez kullanın. Doğrudan ısıdan, keskin darbelerden ve uzun süreli sudan koruyun." : "Use a soft, lightly damp cloth. Protect from direct heat, sharp impact and standing water."}</p></article></section>
    <div className="detail-back"><a href={`/${locale}/products`}><ArrowLeft />{tr ? "Koleksiyona dön" : "Back to collection"}</a><a href={`/${locale}/design?product=${product.id}`}>{tr ? "Bu parçadan yola çık" : "Begin with this piece"}<ArrowUpRight /></a></div>
    <InquiryBand locale={locale} />
  </InnerShell>;
}
