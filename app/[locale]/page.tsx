import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Hammer, Layers3, ScanLine, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TreeExperienceLoader } from "@/components/tree-experience-loader";
import { HeroGallery } from "@/components/hero-gallery";
import { copy, isLocale, products, trees } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tr = locale === "tr";
  const t = copy[locale];
  const content = await resolveContent(locale, {
    "hero.title": t.heroTitle, "hero.subtitle": t.heroSubtitle, "hero.image": "/images/hero-olive-epoxy.webp",
    "story.title": t.storyTitle, "story.body": t.storyBody, "products.title": t.productsTitle,
    "process.title": t.processTitle, "cta.title": t.ctaTitle, "footer.text": t.footer,
  });
  return <main className="public-site">
    <SiteHeader locale={locale} />
    <section className="hero">
      <div className="hero-content">
        <div className="hero-kicker"><span>01</span><p className="eyebrow">{t.heroEyebrow}</p></div>
        <h1>{content["hero.title"]}</h1>
        <p>{content["hero.subtitle"]}</p>
        <div className="hero-actions"><Link className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></Link><Link className="button glass" href="#woods">{t.heroPrimary}<ArrowDown /></Link></div>
        <div className="hero-signature"><span>WU</span><p>{tr ? "Adana'da tasarlandı. Tek parça üretildi." : "Designed in Adana. Made as one of one."}</p></div>
      </div>
      <div className="hero-visual">
        <HeroGallery locale={locale} initialImage={content["hero.image"]} />
      </div>
      <div className="hero-facts"><span><strong>01</strong>{tr ? "Tek parça" : "One of one"}</span><span><strong>02</strong>{tr ? "Ölçünüze göre" : "Made to measure"}</span><span><strong>03</strong>{tr ? "Şeffaf üretim" : "Visible making"}</span></div>
    </section>
    <section className="story-intro"><div className="story-index">02 / 06</div><div><p className="eyebrow">{t.storyEyebrow}</p><h2>{content["story.title"]}</h2></div><div className="story-note"><p>{content["story.body"]}</p><span>{tr ? "Kaydırarak ağacın katmanlarını ayırın" : "Scroll to separate the layers of the tree"}<ArrowRight /></span></div></section>
    <TreeExperienceLoader locale={locale} />
    <section className="wood-index"><div className="section-number">03 / 06</div><div className="section-heading"><div><p className="eyebrow">{tr ? "DAMAR KÜTÜPHANESİ" : "GRAIN LIBRARY"}</p><h2>{tr ? "Dört ağaç. Dört ayrı ritim." : "Four woods. Four distinct rhythms."}</h2></div><p>{tr ? "Her levha, ağacın büyüdüğü iklimin ve geçen yılların fiziksel kaydıdır. Yaş aralıkları yaklaşık değerlerdir." : "Every slab is a physical record of climate and time. Age ranges are indicative."}</p></div><div className="wood-grid">{trees.map((tree, index) => <article key={tree.id} style={{ "--wood": tree.tone } as React.CSSProperties}><span>0{index + 1}</span><div className="grain-orbit" /><div className="wood-card-copy"><h3>{tr ? tree.tr : tree.en}</h3><p>{tr ? tree.traitTr : tree.traitEn}</p><small>{tree.years} {tr ? "yıl" : "years"}</small></div></article>)}</div></section>
    <section className="collection" id="projects"><div className="section-number">04 / 06</div><div className="section-heading"><div><p className="eyebrow">{t.productsEyebrow}</p><h2>{content["products.title"]}</h2></div><Link className="text-link" href={`/${locale}/products`}>{tr ? "Koleksiyonun tamamı" : "View full collection"}<ArrowUpRight /></Link></div><div className="product-grid">{products.slice(0, 3).map((product, index) => <article className={index === 0 ? "product-card featured" : "product-card"} key={product.id}><img src={product.image} alt={tr ? product.nameTr : product.nameEn} /><div className="product-shade" /><div className="product-copy"><p>{tr ? product.categoryTr : product.categoryEn}</p><h3>{tr ? product.nameTr : product.nameEn}</h3><span>{product.dimensions}</span><Link href={`/${locale}/design?product=${product.id}`}>{tr ? "Bu parçadan yola çık" : "Begin with this piece"}<ArrowUpRight /></Link></div></article>)}</div></section>
    <section className="process" id="process"><div className="section-number">05 / 06</div><div className="section-heading light"><div><p className="eyebrow">{tr ? "ATÖLYE SÜRECİ" : "WORKSHOP PROCESS"}</p><h2>{content["process.title"]}</h2></div><p>{tr ? "Karar verdiğiniz andan teslimata kadar her adımı görünür kılan sade bir süreç." : "A clear process that keeps every stage visible, from first decision to delivery."}</p></div><div className="process-grid"><Process icon={<ScanLine />} no="01" title={tr ? "Talep ve keşif" : "Request & discovery"} body={tr ? "Ölçünüzü, kullanım alanını ve beğendiğiniz karakteri birlikte belirleriz." : "We define dimensions, use and the character you prefer."} /><Process icon={<Layers3 />} no="02" title={tr ? "Plaka seçimi" : "Slab selection"} body={tr ? "Size uygun gerçek ahşap plakaları fotoğraf ve video ile sunarız." : "We present suitable real slabs through photos and video."} /><Process icon={<Hammer />} no="03" title={tr ? "Üretim" : "Making"} body={tr ? "Her aşama sipariş takip ekranınıza fotoğraflarla işlenir." : "Each stage is added to your tracking page with photos."} /><Process icon={<Truck />} no="04" title={tr ? "Kontrol ve teslimat" : "Quality & delivery"} body={tr ? "Son kontrollerden sonra teslimat planını birlikte kesinleştiririz." : "After final checks, we confirm the delivery plan together."} /></div></section>
    <section className="final-cta"><div className="final-cta-visual"><img src="/images/olive-console.webp" alt={tr ? "Masif zeytin ağacı konsol" : "Solid olive wood console"} /><span>06 / 06</span></div><div className="final-cta-copy"><p className="eyebrow">{tr ? "SİZE ÖZEL" : "MADE FOR YOU"}</p><h2>{content["cta.title"]}</h2><p>{tr ? "Ödeme yapmadan talebinizi oluşturun. Atölye, uygun levhaları ve üretim planını sizinle birlikte netleştirsin." : "Create your request without payment. The workshop will confirm available slabs and the production plan with you."}</p><div><Link className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></Link><Link className="button ghost-light" href={`/${locale}/track`}>{t.nav.track}</Link></div></div></section>
    <footer className="site-footer"><div className="brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div><p>{content["footer.text"]}</p><div><a href="https://www.instagram.com/woodenuniverse.official/" target="_blank" rel="noreferrer">Instagram</a><Link href={`/${locale}/track`}>{t.nav.track}</Link><Link href="/admin">Admin</Link></div><small>© {new Date().getFullYear()} WoodenUniverse</small></footer>
  </main>;
}

function Process({ icon, no, title, body }: { icon: React.ReactNode; no: string; title: string; body: string }) { return <article>{icon}<span>{no}</span><h3>{title}</h3><p>{body}</p></article>; }
