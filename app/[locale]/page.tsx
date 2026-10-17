import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TreeExperienceLoader } from "@/components/tree-experience-loader";
import { HeroGallery } from "@/components/hero-gallery";
import { GhostTypeHeading, RevealHeading3D, RibbonType, ScrollRevealController, TextReveal3D } from "@/components/editorial-motion";
import { ProductFlipbook } from "@/components/product-flipbook";
import { SiteFooter } from "@/components/site-footer";
import { copy, isLocale, trees } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";
import { furnitureCategories, localized } from "@/lib/collection-data";
import { getCatalog } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const t = copy[locale];
  const products = await getCatalog("products");
  const content = await resolveContent(locale, {
    "hero.title": t.heroTitle, "hero.subtitle": t.heroSubtitle, "hero.image": "/images/real/black-epoxy-dining.jpeg",
    "story.title": t.storyTitle, "story.body": t.storyBody, "products.title": t.productsTitle,
    "process.title": t.processTitle, "cta.title": t.ctaTitle, "footer.text": t.footer,
  });
  return <main className="public-site">
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
    <section className="home-priority"><div className="section-heading blur-reveal"><div><p className="eyebrow">{tr ? "ÖNCELİKLİ MOBİLYALAR" : "PRIORITY FURNITURE"}</p><RevealHeading3D>{tr ? "Mekânın merkezini kuran üç parça." : "Three pieces that define the space."}</RevealHeading3D></div><p>{tr ? "TV ünitesi, konsol ve kahve köşesi; ölçünüz, kullanımınız ve seçtiğiniz malzemeyle yeniden çizilir." : "TV units, consoles and coffee corners redrawn around your dimensions, use and material."}</p></div><div className="priority-grid">{furnitureCategories.filter((item) => item.priority).map((item, index) => <a className="priority-card blur-reveal" href={`/${locale}/products/category/${item.id}`} key={item.id}><img src={item.image} alt={localized(item.title, locale)} /><span>0{index + 1}</span><div><small>{localized(item.eyebrow, locale)}</small><h3>{localized(item.title, locale)}</h3><p>{localized(item.description, locale)}</p><ArrowUpRight /></div></a>)}</div></section>
    <section className="story-intro blur-reveal"><div className="story-index">02 / 06</div><div><p className="eyebrow">{t.storyEyebrow}</p><RevealHeading3D>{content["story.title"]}</RevealHeading3D></div><div className="story-note"><p>{content["story.body"]}</p><span>{tr ? "Kaydırarak ağacın katmanlarını ayırın" : "Scroll to separate the layers of the tree"}<ArrowRight /></span></div></section>
    <TreeExperienceLoader locale={locale} />
    <RibbonType locale={locale} />
    <section className="wood-index"><div className="section-number">03 / 06</div><div className="section-heading blur-reveal"><div><p className="eyebrow">{tr ? "DAMAR KÜTÜPHANESİ" : "GRAIN LIBRARY"}</p><RevealHeading3D>{tr ? "On ağaç. On ayrı karakter." : "Ten woods. Ten distinct characters."}</RevealHeading3D></div><p>{tr ? "Her levha, ağacın büyüdüğü iklimin ve geçen yılların fiziksel kaydıdır. Yaş aralıkları yaklaşık değerlerdir." : "Every slab is a physical record of climate and time. Age ranges are indicative."}</p></div><div className="wood-grid">{trees.map((tree, index) => <article className="blur-reveal" key={tree.id} style={{ "--wood": tree.tone } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><div className="grain-orbit" /><div className="wood-card-copy"><h3>{tr ? tree.tr : tree.en}</h3><p>{tr ? tree.traitTr : tree.traitEn}</p><small>{tree.years} {tr ? "yıl" : "years"}</small></div></article>)}</div></section>
    <ProductFlipbook locale={locale} products={products} />
    <section className="process" id="process"><div className="section-number">05 / 06</div><div className="section-heading light blur-reveal"><div><p className="eyebrow">{tr ? "ATÖLYE SÜRECİ" : "WORKSHOP PROCESS"}</p><RevealHeading3D>{content["process.title"]}</RevealHeading3D></div><p>{tr ? "Karar verdiğiniz andan teslimata kadar her adımı görünür kılan sade bir süreç." : "A clear process that keeps every stage visible, from first decision to delivery."}</p></div><ol className="process-flow">
      <ProcessStep no="01" title={tr ? "Talep ve keşif" : "Request & discovery"} body={tr ? "Ölçü, kullanım alanı ve aradığınız karakteri birlikte belirleriz." : "We define dimensions, use and the character you seek."} />
      <ProcessStep no="02" title={tr ? "Plaka seçimi" : "Slab selection"} body={tr ? "Size uygun gerçek plakaları fotoğraf ve video ile sunarız." : "We present suitable real slabs through photos and video."} />
      <ProcessStep no="03" title={tr ? "Atölye" : "Workshop"} body={tr ? "Üretimin her aşamasını sipariş takibinize fotoğraflarla işleriz." : "We document every making stage in your order tracking."} />
      <ProcessStep no="04" title={tr ? "Teslimat" : "Delivery"} body={tr ? "Son kontrolden sonra teslimat planını birlikte kesinleştiririz." : "After final inspection, we confirm delivery together."} />
    </ol></section>
    <section className="final-cta"><div className="final-cta-visual"><img src="/images/real/solid-console.jpeg" alt={tr ? "Masif ahşap konsol" : "Solid wood console"} /><span>06 / 06</span></div><div className="final-cta-copy"><p className="eyebrow">{tr ? "SİZE ÖZEL" : "MADE FOR YOU"}</p><RevealHeading3D>{content["cta.title"]}</RevealHeading3D><p>{tr ? "Ödeme yapmadan talebinizi oluşturun. Atölye, uygun levhaları ve üretim planını sizinle birlikte netleştirsin." : "Create your request without payment. The workshop will confirm available slabs and the production plan with you."}</p><div><a className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></a><a className="button ghost-light" href={`/${locale}/track`}>{t.nav.track}</a></div></div></section>
    <SiteFooter locale={locale} />
  </main>;
}

function ProcessStep({ no, title, body }: { no: string; title: string; body: string }) {
  return <li className="blur-reveal"><span>{no}</span><h3>{title}</h3><p>{body}</p></li>;
}
