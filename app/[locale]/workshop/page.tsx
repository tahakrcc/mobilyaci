import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { resolveContent } from "@/lib/content-store";

export default async function WorkshopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound(); const locale = rawLocale; const tr = locale === "tr";
  const content = await resolveContent(locale, { "workshop.title": tr ? "Hızlı değil; doğru ritimde üretilir." : "Not rushed; made at the right rhythm.", "workshop.body": tr ? "Doğal ahşap, zaman ve dikkat ister. Her karar görünür; her aşama takip edilebilir." : "Natural wood asks for time and attention. Every decision is visible and every stage can be followed." });
  const steps = tr ? [
    ["01", "Talep ve keşif", "Ölçüyü, kullanım alanını, mekânın ışığını ve aradığınız karakteri dinleriz."],
    ["02", "Gerçek plaka seçimi", "Uygun plakaları fotoğraf ve videolarıyla sunar, birlikte tek bir ağacı seçeriz."],
    ["03", "Oran ve detay", "Ayak sistemi, kenar formu, epoksi tonu ve yüzey numunesi netleşir."],
    ["04", "Kurutma ve hazırlık", "Nem kontrolü yapılan plaka temizlenir, dengelenir ve üretime hazırlanır."],
    ["05", "Üretim", "Kesim, kalıp, epoksi, tesviye ve zımpara aşamaları takip ekranınıza işlenir."],
    ["06", "Kontrol ve teslimat", "Yüzey ve ölçü kontrolleri tamamlanır; paketleme ve teslimat birlikte planlanır."],
  ] : [
    ["01", "Request and discovery", "We listen to dimensions, use, the room's light and the character you are looking for."],
    ["02", "Actual slab selection", "We present suitable slabs by photo and video and select one piece together."],
    ["03", "Proportion and detail", "Base, edge, resin tone and finish sample are finalized."],
    ["04", "Drying and preparation", "The moisture-checked slab is cleaned, balanced and prepared for making."],
    ["05", "Making", "Cutting, moulding, resin, leveling and sanding are recorded in your tracking page."],
    ["06", "Inspection and delivery", "Finish and dimensions are checked; packaging and delivery are planned together."],
  ];
  return <InnerShell locale={locale}><InnerHero locale={locale} eyebrow={tr ? "ATÖLYE" : "WORKSHOP"} title={content["workshop.title"]} lead={content["workshop.body"]} image="/images/walnut-desk.webp" index="PROCESS / 01" />
    <section className="workshop-steps">{steps.map(([no,title,body]) => <article className="blur-reveal" key={no}><span>{no}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}</section>
    <section className="workshop-note"><p className="eyebrow">{tr ? "ŞEFFAF ÜRETİM" : "VISIBLE MAKING"}</p><h2>{tr ? "Atölyede ilerleyen parça, takip ekranınızda da ilerler." : "As your piece moves through the workshop, it moves through your tracking page."}</h2><p>{tr ? "Sipariş numaranız ve güvenli bağlantınızla on bir üretim durumunu, atölye notlarını ve paylaşılan görselleri görebilirsiniz." : "Use your order number and secure link to see eleven production states, workshop notes and shared images."}</p></section><InquiryBand locale={locale} /></InnerShell>;
}
