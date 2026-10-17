import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale, trees } from "@/lib/catalog";
import { treeProfiles } from "@/lib/site-content";
import { getCatalog } from "@/lib/catalog-store";

export default async function WoodDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params; if (!isLocale(rawLocale)) notFound();
  const tree = trees.find((item) => item.id === id); if (!tree) notFound();
  const locale = rawLocale; const tr = locale === "tr"; const profile = treeProfiles[id as keyof typeof treeProfiles];
  const related = (await getCatalog("products")).filter((product) => product.wood === id);
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={tr ? "DAMAR KÜTÜPHANESİ" : "GRAIN LIBRARY"} title={profile.title[locale]} lead={profile.lead[locale]} image={profile.image} index={`WOOD / ${String(trees.findIndex((item) => item.id === id) + 1).padStart(2, "0")}`} />
    <section className="material-profile"><div className="material-ring blur-reveal" style={{ "--wood": tree.tone } as React.CSSProperties} /><div className="material-copy blur-reveal"><p className="eyebrow">{tr ? "KARAKTER" : "CHARACTER"}</p><h2>{profile.character[locale]}</h2><p>{tr ? "Kesim yönü, kuruma biçimi ve ağacın yaşadığı iklim her plakadaki ritmi değiştirir. Bu nedenle önce gerçek plakayı seçer, tasarımı onun sınırlarına göre çizeriz." : "Cut direction, drying and climate change the rhythm of every slab. We therefore select the actual slab first and draw the design around its boundaries."}</p><dl><div><dt>{tr ? "Tipik olgunluk" : "Typical maturity"}</dt><dd>{tree.years} {tr ? "yıl" : "years"}</dd></div><div><dt>{tr ? "Uygun kullanım" : "Best suited"}</dt><dd>{profile.use[locale]}</dd></div><div><dt>{tr ? "Yüzey" : "Finish"}</dt><dd>{profile.finish[locale]}</dd></div><div><dt>{tr ? "Köken" : "Origin"}</dt><dd>{profile.origin[locale]}</dd></div></dl></div></section>
    {related.length > 0 && <section className="related-section"><p className="eyebrow">{tr ? "BU AĞAÇLA ÜRETİLENLER" : "MADE WITH THIS WOOD"}</p><div className="related-grid">{related.map((product) => <a href={`/${locale}/products/${product.id}`} key={product.id}><img src={product.image} alt={tr ? product.nameTr : product.nameEn} /><h3>{tr ? product.nameTr : product.nameEn}</h3><span>{product.dimensions}</span></a>)}</div></section>}
    <div className="detail-back"><a href={`/${locale}/woods`}><ArrowLeft />{tr ? "Tüm ağaçlar" : "All woods"}</a></div><InquiryBand locale={locale} />
  </InnerShell>;
}
