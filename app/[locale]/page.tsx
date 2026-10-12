import Link from "next/link";
import { ArrowDown, ArrowUpRight, Hammer, Layers3, ScanLine, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { TreeExperienceLoader } from "@/components/tree-experience-loader";
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
      <img className="hero-image" src={content["hero.image"]} alt={tr ? "Zeytin ağacı ve siyah epoksi yemek masası" : "Olive wood and black epoxy dining table"} />
      <div className="hero-overlay" />
      <div className="hero-content"><p className="eyebrow">{t.heroEyebrow}</p><h1>{content["hero.title"]}</h1><p>{content["hero.subtitle"]}</p><div className="hero-actions"><Link className="button gold" href="#woods">{t.heroPrimary}<ArrowDown /></Link><Link className="button glass" href={`/${locale}/products`}>{t.heroSecondary}<ArrowUpRight /></Link></div></div>
      <div className="hero-facts"><span><strong>01</strong>{tr ? "Her parça benzersiz" : "Every piece is unique"}</span><span><strong>02</strong>{tr ? "Ölçünüze özel" : "Made to measure"}</span><span><strong>03</strong>{tr ? "Üretimi takip edin" : "Track the making"}</span></div>
    </section>
    <section className="story-intro"><p className="eyebrow">{t.storyEyebrow}</p><h2>{content["story.title"]}</h2><p>{content["story.body"]}</p></section>
    <TreeExperienceLoader locale={locale} />
    <section className="wood-index"><div className="section-heading"><div><p className="eyebrow">{tr ? "DAMAR KÜTÜPHANESİ" : "GRAIN LIBRARY"}</p><h2>{tr ? "Her tür, farklı bir karakter." : "Every species has a different character."}</h2></div><p>{tr ? "Yaş aralıkları tür ve yetişme koşullarına göre değişen tipik değerlerdir; kesin yaş, kaynağı doğrulanmış parçalarda belirtilir." : "Age ranges are indicative and vary by species and growing conditions; exact age is only shown for verified pieces."}</p></div><div className="wood-grid">{trees.map((tree, index) => <article key={tree.id} style={{ "--wood": tree.tone } as React.CSSProperties}><span>0{index + 1}</span><div className="grain-orbit" /><h3>{tr ? tree.tr : tree.en}</h3><p>{tr ? tree.traitTr : tree.traitEn}</p><small>{tree.years} {tr ? "yıl" : "years"}</small></article>)}</div></section>
    <section className="collection" id="projects"><div className="section-heading"><div><p className="eyebrow">{t.productsEyebrow}</p><h2>{content["products.title"]}</h2></div><Link className="text-link" href={`/${locale}/products`}>{tr ? "Tüm koleksiyon" : "Full collection"}<ArrowUpRight /></Link></div><div className="product-grid">{products.slice(0, 3).map((product, index) => <article className={index === 0 ? "product-card featured" : "product-card"} key={product.id}><img src={product.image} alt={tr ? product.nameTr : product.nameEn} /><div className="product-shade" /><div className="product-copy"><p>{tr ? product.categoryTr : product.categoryEn}</p><h3>{tr ? product.nameTr : product.nameEn}</h3><span>{product.dimensions}</span><Link href={`/${locale}/design?product=${product.id}`}>{tr ? "Bu tasarımdan başla" : "Start from this design"}<ArrowUpRight /></Link></div></article>)}</div></section>
    <section className="process" id="process"><div className="section-heading light"><div><p className="eyebrow">{tr ? "ATÖLYE SÜRECİ" : "WORKSHOP PROCESS"}</p><h2>{content["process.title"]}</h2></div></div><div className="process-grid"><Process icon={<ScanLine />} no="01" title={tr ? "Talep ve keşif" : "Request & discovery"} body={tr ? "Ölçünüzü, kullanım alanını ve beğendiğiniz karakteri birlikte belirleriz." : "We define dimensions, use and the character you prefer."} /><Process icon={<Layers3 />} no="02" title={tr ? "Plaka seçimi" : "Slab selection"} body={tr ? "Size uygun gerçek ahşap plakaları fotoğraf ve video ile sunarız." : "We present suitable real slabs through photos and video."} /><Process icon={<Hammer />} no="03" title={tr ? "Üretim" : "Making"} body={tr ? "Her aşama sipariş takip ekranınıza fotoğraflarla işlenir." : "Each stage is added to your tracking page with photos."} /><Process icon={<Truck />} no="04" title={tr ? "Kontrol ve teslimat" : "Quality & delivery"} body={tr ? "Son kontrollerden sonra teslimat planını birlikte kesinleştiririz." : "After final checks, we confirm the delivery plan together."} /></div></section>
    <section className="final-cta"><p className="eyebrow">{tr ? "SİZE ÖZEL" : "MADE FOR YOU"}</p><h2>{content["cta.title"]}</h2><div><Link className="button gold" href={`/${locale}/design`}>{t.nav.design}<ArrowUpRight /></Link><Link className="button ghost-light" href={`/${locale}/track`}>{t.nav.track}</Link></div></section>
    <footer className="site-footer"><div className="brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div><p>{content["footer.text"]}</p><div><a href="https://www.instagram.com/woodenuniverse.official/" target="_blank" rel="noreferrer">Instagram</a><Link href={`/${locale}/track`}>{t.nav.track}</Link><Link href="/admin">Admin</Link></div><small>© {new Date().getFullYear()} WoodenUniverse</small></footer>
  </main>;
}

function Process({ icon, no, title, body }: { icon: React.ReactNode; no: string; title: string; body: string }) { return <article>{icon}<span>{no}</span><h3>{title}</h3><p>{body}</p></article>; }
