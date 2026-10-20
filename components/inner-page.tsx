import { SiteImage } from "@/components/site-image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/catalog";
import { RevealHeading3D, ScrollRevealController } from "@/components/editorial-motion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function InnerShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <main className="public-site inner-site"><ScrollRevealController /><SiteHeader locale={locale} />{children}<SiteFooter locale={locale} /></main>;
}

export function InnerHero({ locale, eyebrow, title, lead, image, imagePosition, mobileImagePosition, index = "WU / 01" }: { locale: Locale; eyebrow: string; title: string; lead: string; image?: string; imagePosition?: string; mobileImagePosition?: string; index?: string }) {
  return <header className={`inner-hero ${image ? "has-image" : ""}`}>
    {image && <SiteImage src={image} position={imagePosition} mobilePosition={mobileImagePosition} alt="" />}
    <div className="inner-hero-shade" />
    <div className="inner-hero-index">{index}</div>
    <div className="inner-hero-copy"><p className="eyebrow">{eyebrow}</p><RevealHeading3D>{title}</RevealHeading3D><p>{lead}</p></div>
    <nav className="breadcrumbs" aria-label={locale === "tr" ? "Sayfa yolu" : "Breadcrumb"}><a href={`/${locale}`}>{locale === "tr" ? "Ana Sayfa" : "Home"}</a><ArrowRight /><span>{eyebrow}</span></nav>
  </header>;
}

export function InquiryBand({ locale, title }: { locale: Locale; title?: string }) {
  const tr = locale === "tr";
  return <section className="inquiry-band blur-reveal"><p className="eyebrow">{tr ? "BİRLİKTE TASARLAYALIM" : "LET'S DESIGN TOGETHER"}</p><h2>{title ?? (tr ? "Bu parçadan yola çıkın, size ait olanı birlikte oluşturalım." : "Begin with this piece and let us shape one that is yours.")}</h2><div><a className="button gold" href={`/${locale}/design`}>{tr ? "Tasarımını oluştur" : "Create yours"}<ArrowUpRight /></a><a className="button ghost-light" href={`/${locale}/contact`}>{tr ? "İletişime geç" : "Contact us"}</a></div></section>;
}
