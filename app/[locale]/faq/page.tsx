import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { faqs, local } from "@/lib/site-content";

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound(); const locale = rawLocale; const tr = locale === "tr";
  return <InnerShell locale={locale}><InnerHero locale={locale} eyebrow={tr ? "SIK SORULANLAR" : "FAQ"} title={tr ? "Karar vermeden önce bilmek isteyecekleriniz." : "What you may want to know before deciding."} lead={tr ? "Sipariş, malzeme, üretim ve takip süreciyle ilgili temel yanıtlar." : "Essential answers about requests, materials, production and tracking."} index="INFO / 01" />
    <section className="faq-list">{faqs.map((item,index) => <details className="blur-reveal" key={local(item.q,locale)}><summary><span>0{index + 1}</span><h2>{local(item.q,locale)}</h2><i>+</i></summary><p>{local(item.a,locale)}</p></details>)}</section><InquiryBand locale={locale} /></InnerShell>;
}
