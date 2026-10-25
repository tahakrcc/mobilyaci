import { SiteImage } from "@/components/site-image";
import { PriorityCategoryCard } from "@/components/priority-category-card";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TreeExperienceLoader } from "@/components/tree-experience-loader";
import { HeroGallery } from "@/components/hero-gallery";
import { GhostTypeHeading, RevealHeading3D, RibbonType, ScrollRevealController, TextReveal3D } from "@/components/editorial-motion";
import { ProductFlipbook } from "@/components/product-flipbook";
import { SiteFooter } from "@/components/site-footer";
import { SiteIntroLoader } from "@/components/site-intro-loader";
import { copy, isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { localized } from "@/lib/collection-data";
import { getCatalog, getFurnitureCategories, getSharedAssetUrl } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const t = copy[locale];
  const [products, furnitureCategories, treeModelUrl] = await Promise.all([
    getCatalog("products"),
    getFurnitureCategories(),
    getSharedAssetUrl("asset.wood-journey-model", "/models/wood-journey.glb"),
  ]);
  const content = await resolveContent(locale, {
    "hero.title": t.heroTitle, "hero.subtitle": t.heroSubtitle, "hero.image": "/images/real/black-epoxy-dining.jpeg",
    "story.title": t.storyTitle, "story.body": t.storyBody, "products.title": t.productsTitle,
    "process.title": t.processTitle, "cta.title": t.ctaTitle, "footer.text": t.footer,
  });
  return <main className="public-site">
    <SiteIntroLoader locale={locale} />
    <ScrollRevealController />
    <SiteHeader locale={locale} />
    <section className="hero">
      <div className="hero-content">
        <div className="hero-kicker"><span>01</span><p className="eyebrow">{t.heroEyebrow}</p></div>
        <GhostTypeHeading title={content["hero.title"]} locale={locale} />
        <p>{content["hero.subtitle"]}</p>
        <div className="hero-actions"><a className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></a><a className="hero-scroll-cue" href="#manifesto">{tr ? "Keşfet" : "Explore"}<ArrowDown /></a></div>
      </div>
      <div className="hero-visual">
        <HeroGallery locale={locale} initialImage={content["hero.image"]} products={products} />
      </div>
    </section>
    <div id="manifesto"><TextReveal3D locale={locale} /></div>
    <section className="home-priority"><div className="section-heading blur-reveal"><div><p className="eyebrow">{tr ? "ÖNCELİKLİ MOBİLYALAR" : "PRIORITY FURNITURE"}</p><RevealHeading3D>{tr ? "Mekânın karakterini kuran dört parça." : "Four pieces that define the space."}</RevealHeading3D></div><p>{tr ? "TV ünitesi, konsol, bar ve kitaplık; ölçünüz, kullanımınız ve seçtiğiniz malzemeyle yeniden çizilir." : "TV units, consoles, bars and bookcases redrawn around your dimensions, use and material."}</p></div><div className="priority-grid">{furnitureCategories.filter((item) => item.priority).map((item, index) => <PriorityCategoryCard href={`/${locale}/products/category/${item.id}`} title={localized(item.title, locale)} eyebrow={localized(item.eyebrow, locale)} description={localized(item.description, locale)} images={item.gallery ?? [item.image]} number={`0${index + 1}`} order={index} key={item.id} />)}</div></section>
    <section className="story-intro blur-reveal"><div className="story-index">02 / 05</div><div><p className="eyebrow">{t.storyEyebrow}</p><RevealHeading3D>{content["story.title"]}</RevealHeading3D></div><div className="story-note"><p>{content["story.body"]}</p><span>{tr ? "Kaydırarak ağacın katmanlarını ayırın" : "Scroll to separate the layers of the tree"}<ArrowRight /></span></div></section>
    <TreeExperienceLoader locale={locale} modelUrl={treeModelUrl} />
    <RibbonType locale={locale} />
    <ProductFlipbook locale={locale} products={products} />
    <section className="process" id="process"><div className="section-number">04 / 05</div><div className="section-heading light blur-reveal"><div><p className="eyebrow">{tr ? "ATÖLYE SÜRECİ" : "WORKSHOP PROCESS"}</p><RevealHeading3D>{content["process.title"]}</RevealHeading3D></div><p>{tr ? "Karar verdiğiniz andan teslimata kadar her adımı görünür kılan sade bir süreç." : "A clear process that keeps every stage visible, from first decision to delivery."}</p></div><ol className="process-flow">
      <ProcessStep no="01" title={tr ? "Talep ve keşif" : "Request & discovery"} body={tr ? "Ölçü, kullanım alanı ve aradığınız karakteri birlikte belirleriz." : "We define dimensions, use and the character you seek."} />
      <ProcessStep no="02" title={tr ? "Plaka seçimi" : "Slab selection"} body={tr ? "Size uygun gerçek plakaları fotoğraf ve video ile sunarız." : "We present suitable real slabs through photos and video."} />
      <ProcessStep no="03" title={tr ? "Atölye" : "Workshop"} body={tr ? "Üretimin her aşamasını sipariş takibinize fotoğraflarla işleriz." : "We document every making stage in your order tracking."} />
      <ProcessStep no="04" title={tr ? "Teslimat" : "Delivery"} body={tr ? "Son kontrolden sonra teslimat planını birlikte kesinleştiririz." : "After final inspection, we confirm delivery together."} />
    </ol></section>
    <section className="final-cta"><div className="final-cta-visual"><SiteImage src="/images/real/solid-console.jpeg" alt={tr ? "Masif ahşap konsol" : "Solid wood console"} /><span>05 / 05</span></div><div className="final-cta-copy"><p className="eyebrow">{tr ? "SİZE ÖZEL" : "MADE FOR YOU"}</p><RevealHeading3D>{content["cta.title"]}</RevealHeading3D><p>{tr ? "Ödeme yapmadan talebinizi oluşturun. Atölye, uygun levhaları ve üretim planını sizinle birlikte netleştirsin." : "Create your request without payment. The workshop will confirm available slabs and the production plan with you."}</p><div><a className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></a><a className="button ghost-light" href={`/${locale}/track`}>{t.nav.track}</a></div></div></section>
    <SiteFooter locale={locale} />
  </main>;
}

function ProcessStep({ no, title, body }: { no: string; title: string; body: string }) {
  return <li className="blur-reveal"><span>{no}</span><h3>{title}</h3><p>{body}</p></li>;
}
