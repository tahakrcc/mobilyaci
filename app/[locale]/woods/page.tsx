import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale, trees } from "@/lib/catalog";
import { treeProfiles } from "@/lib/site-content";
import { resolveContent } from "@/lib/content-store";

export default async function WoodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale; const tr = locale === "tr";
  const content = await resolveContent(locale, { "woods.title": tr ? "Damar, yaşın görünür hâlidir." : "Grain is age made visible.", "woods.body": tr ? "Aynı türden iki ağaç bile aynı çizgiyi taşımaz. Her plaka, tasarımın biçimini ve rengini yeniden belirler." : "Even two trees of the same species never carry the same line. Every slab redraws the form and color of the piece." });
  return <InnerShell locale={locale}>
    <InnerHero locale={locale} eyebrow={tr ? "AĞAÇLAR" : "WOODS"} title={content["woods.title"]} lead={content["woods.body"]} image="/images/walnut-desk.webp" index="MATERIAL / 01" />
    <section className="editorial-list">{trees.map((tree, index) => { const profile = treeProfiles[tree.id as keyof typeof treeProfiles]; return <a className="editorial-row blur-reveal" href={`/${locale}/woods/${tree.id}`} key={tree.id}><span>0{index + 1}</span><div><small>{tree.years} {tr ? "YIL" : "YEARS"}</small><h2>{tr ? tree.tr : tree.en}</h2><p>{tr ? tree.traitTr : tree.traitEn}</p></div><img src={profile.image} alt={tr ? tree.tr : tree.en} /><ArrowUpRight /></a>; })}</section>
    <InquiryBand locale={locale} title={tr ? "Ağacı seçerek başlayın; form onun karakterinden doğsun." : "Begin with the wood and let the form grow from its character."} />
  </InnerShell>;
}
