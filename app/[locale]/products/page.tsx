import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale, products, trees } from "@/lib/catalog";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound(); const locale = rawLocale; const tr = locale === "tr";
  return <main className="public-site catalog-page"><SiteHeader locale={locale} /><header className="page-hero"><p className="eyebrow">{tr ? "KOLEKSİYON" : "COLLECTION"}</p><h1>{tr ? "Doğanın tekrarlamadığı parçalar." : "Pieces nature will not repeat."}</h1><p>{tr ? "Bu çalışmalar ölçü, renk ve ahşap karakteri için başlangıç noktasıdır. Her yeni sipariş mevcut plakalara göre yeniden yorumlanır." : "These works are starting points for dimensions, color and character. Every commission is reinterpreted around available slabs."}</p></header><section className="catalog-grid">{products.map((product) => { const tree = trees.find((item) => item.id === product.wood); return <article key={product.id}><a className="catalog-image-link" href={`/${locale}/products/${product.id}`}><img src={product.image} alt={tr ? product.nameTr : product.nameEn} /></a><div><small>{tr ? product.categoryTr : product.categoryEn}</small><h2><a href={`/${locale}/products/${product.id}`}>{tr ? product.nameTr : product.nameEn}</a></h2><p>{tr ? tree?.tr : tree?.en} · {tr ? product.epoxyTr : product.epoxyEn}<br />{product.dimensions}</p><div className="catalog-actions"><a className="text-link" href={`/${locale}/products/${product.id}`}>{tr ? "Detayları gör" : "View details"}</a><a className="button dark" href={`/${locale}/design?product=${product.id}`}>{tr ? "Talep oluştur" : "Create request"}<ArrowUpRight /></a></div></div></article>; })}</section><SiteFooter locale={locale} /></main>;
}
