"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { trees } from "@/lib/catalog";

type FormState = {
  productType: string; woodType: string; epoxy: string; legStyle: string; dimensions: string; finish: string;
  upholstery: string; quantity: string;
  customerName: string; email: string; phone: string; city: string; notes: string; referenceUrl: string;
};

const initial: FormState = { productType: "dining-table", woodType: "olive", epoxy: "smoky-black", legStyle: "sculptural", dimensions: "220 × 100 × 76 cm", finish: "matte", upholstery: "project-fabric", quantity: "1", customerName: "", email: "", phone: "", city: "", notes: "", referenceUrl: "" };

export function OrderBuilder({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ orderNumber: string; trackingToken: string } | null>(null);
  const [error, setError] = useState("");
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const steps = tr ? ["Ürün", "Ağaç", "Detaylar", "Ölçüler", "İletişim", "Özet"] : ["Product", "Wood", "Details", "Dimensions", "Contact", "Summary"];
  const selectedTree = trees.find((item) => item.id === form.woodType) ?? trees[0];
  const isSeating = form.productType === "chair" || form.productType === "bar-chair" || form.productType === "set";
  const canContinue = useMemo(() => step < 4 || Boolean(form.customerName && form.email && form.phone && form.city), [step, form]);
  async function submit() {
    setSending(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, locale, notes: `${form.notes}${form.notes ? "\n\n" : ""}${tr ? "Döşeme" : "Upholstery"}: ${form.upholstery}\n${tr ? "Adet" : "Quantity"}: ${form.quantity}` }) });
      const body = (await response.json()) as { orderNumber?: string; trackingToken?: string; error?: string };
      if (!response.ok) throw new Error(body.error || "failed");
      if (!body.orderNumber || !body.trackingToken) throw new Error("invalid-response");
      setResult({ orderNumber: body.orderNumber, trackingToken: body.trackingToken });
    } catch {
      setError(tr ? "Talep gönderilemedi. Bilgileri kontrol edip tekrar deneyin." : "We could not submit your request. Please check the details and try again.");
    } finally { setSending(false); }
  }
  if (result) return (
    <div className="success-card">
      <span className="success-icon"><Check /></span>
      <p className="eyebrow">{tr ? "TALEBİNİZ ALINDI" : "REQUEST RECEIVED"}</p>
      <h1>{result.orderNumber}</h1>
      <p>{tr ? "Ekibimiz tasarımınızı inceleyip fiyat ve üretim süresi için sizinle iletişime geçecek." : "Our team will review your design and contact you about pricing and lead time."}</p>
      <a className="button light" href={`/${locale}/track?order=${encodeURIComponent(result.orderNumber)}&token=${result.trackingToken}`}>{tr ? "Siparişi takip et" : "Track request"}</a>
    </div>
  );
  return (
    <div className="builder-shell">
      <aside className="builder-aside">
        <p className="eyebrow">{tr ? "KİŞİYE ÖZEL ÜRETİM" : "BESPOKE COMMISSION"}</p>
        <h1>{tr ? "Parçanızı birlikte oluşturalım." : "Let’s shape your piece together."}</h1>
        <div className="step-list">{steps.map((label, index) => <button key={label} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>{index < step ? <Check size={14} /> : index + 1}</span>{label}</button>)}</div>
      </aside>
      <section className="builder-panel">
        {step === 0 && <Choice title={tr ? "Ne tasarlıyoruz?" : "What are we creating?"} value={form.productType} onChange={(v) => update("productType", v)} options={[
          ["tv-unit", tr ? "TV ünitesi" : "TV unit", tr ? "Mekâna özel" : "Made to measure"], ["console", tr ? "Konsol" : "Console", "140–220 cm"], ["coffee-corner", tr ? "Kahve köşesi" : "Coffee corner", tr ? "Mekâna özel" : "Made to measure"], ["dining-table", tr ? "Yemek masası" : "Dining table", "220–300 cm"], ["coffee-table", tr ? "Orta sehpa" : "Coffee table", "90–150 cm"], ["desk", tr ? "Çalışma masası" : "Desk", "160–240 cm"], ["chair", tr ? "Sandalye" : "Chair", tr ? "Model ve adet" : "Model and quantity"], ["bar-chair", tr ? "Bar sandalyesi" : "Bar chair", tr ? "Model ve adet" : "Model and quantity"], ["set", tr ? "Masa ve sandalye seti" : "Table & chair set", tr ? "Kafe veya yemek seti" : "Cafe or dining set"], ["bookcase", tr ? "Kitaplık" : "Bookcase", tr ? "Mekâna özel" : "Made to measure"], ["bar-unit", tr ? "Bar ünitesi" : "Bar unit", tr ? "Mekâna özel" : "Made to measure"], ["custom", tr ? "Özel tasarım" : "Custom piece", tr ? "Birlikte belirleyelim" : "Define together"]]} />}
        {step === 1 && <div><h2>{tr ? "Ağacınızı seçin" : "Choose your wood"}</h2><p className="form-lead">{tr ? "Her parça gerçek damar yapısı nedeniyle benzersizdir." : "Every slab is unique because of its natural grain."}</p><div className="wood-options">{trees.map((tree) => <button key={tree.id} className={form.woodType === tree.id ? "selected" : ""} onClick={() => update("woodType", tree.id)} style={{ "--wood": tree.tone } as React.CSSProperties}><i /><strong>{tr ? tree.tr : tree.en}</strong><span>{tr ? tree.traitTr : tree.traitEn}</span></button>)}</div></div>}
        {step === 2 && <div><h2>{isSeating ? (tr ? "Model ve proje detayları" : "Model and project details") : (tr ? "Yüzey ve konstrüksiyon" : "Surface and construction")}</h2><div className="detail-choice-stack">
          {isSeating ? <>
            <DetailChoice title={tr ? "Döşeme" : "Upholstery"} value={form.upholstery} onChange={(value) => update("upholstery", value)} options={[["project-fabric", tr ? "Proje kumaşı" : "Project fabric"], ["leather", tr ? "Deri" : "Leather"], ["boucle", "Bouclé"], ["customer-choice", tr ? "Birlikte seçelim" : "Choose together"]]} />
            <label className="field"><span>{tr ? "Model adı ve adet" : "Model name and quantity"}</span><input value={form.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder={tr ? "Örn. Luna · 24 adet" : "e.g. Luna · 24 pieces"} /></label>
          </> : <>
            <DetailChoice title={tr ? "Epoksi" : "Resin"} value={form.epoxy} onChange={(value) => update("epoxy", value)} options={[["none", tr ? "Epoksisiz" : "No resin"], ["clear", tr ? "Şeffaf" : "Clear"], ["smoky-black", tr ? "Füme siyah" : "Smoky black"], ["turquoise", tr ? "Turkuaz" : "Turquoise"], ["custom", tr ? "Özel renk" : "Custom color"]]} />
            <DetailChoice title={tr ? "Ayak modeli" : "Base style"} value={form.legStyle} onChange={(value) => update("legStyle", value)} options={[["sculptural", tr ? "Heykelsi çelik" : "Sculptural steel"], ["u-frame", "U Frame"], ["x-frame", "X Frame"], ["wood", tr ? "Masif ahşap" : "Solid wood"]]} />
          </>}
          <DetailChoice title={tr ? "Yüzey" : "Finish"} value={form.finish} onChange={(value) => update("finish", value)} options={[["matte", tr ? "Doğal mat" : "Natural matte"], ["satin", tr ? "Saten" : "Satin"], ["gloss", tr ? "Parlak" : "Gloss"]]} />
        </div></div>}
        {step === 3 && <div><h2>{tr ? "Ölçülerinizi belirleyin" : "Set the dimensions"}</h2><label className="field"><span>{tr ? "Uzunluk × genişlik × yükseklik" : "Length × width × height"}</span><input value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="220 × 100 × 76 cm" /></label><label className="field"><span>{tr ? "İlham görseli bağlantısı (isteğe bağlı)" : "Reference image link (optional)"}</span><input type="url" value={form.referenceUrl} onChange={(e) => update("referenceUrl", e.target.value)} placeholder="https://" /></label><label className="field"><span>{tr ? "Özel notlar" : "Special notes"}</span><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={5} placeholder={tr ? "Kablo kanalı, çekmece, özel kenar…" : "Cable channel, drawer, edge treatment…"} /></label></div>}
        {step === 4 && <div><h2>{tr ? "Sizinle nasıl iletişim kuralım?" : "How should we reach you?"}</h2><div className="field-grid"><label className="field"><span>{tr ? "Ad soyad" : "Full name"}</span><input value={form.customerName} onChange={(e) => update("customerName", e.target.value)} /></label><label className="field"><span>E-mail</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value.toLowerCase())} /></label><label className="field"><span>{tr ? "Telefon" : "Phone"}</span><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label><label className="field"><span>{tr ? "Şehir" : "City"}</span><input value={form.city} onChange={(e) => update("city", e.target.value)} /></label></div><p className="privacy-note">{tr ? "Göndererek iletişim bilgilerinizin teklif hazırlamak amacıyla kullanılmasını kabul edersiniz. Bu işlem ödeme oluşturmaz." : "By submitting, you agree that your contact details may be used to prepare a quote. No payment is created."}</p></div>}
        {step === 5 && <div><h2>{tr ? "Tasarım özeti" : "Design summary"}</h2><div className="summary-grid"><Summary label={tr ? "Ürün" : "Product"} value={form.productType} /><Summary label={tr ? "Ağaç" : "Wood"} value={tr ? selectedTree.tr : selectedTree.en} /><Summary label={isSeating ? (tr ? "Döşeme" : "Upholstery") : (tr ? "Epoksi" : "Resin")} value={isSeating ? form.upholstery : form.epoxy} /><Summary label={isSeating ? (tr ? "Model / adet" : "Model / quantity") : (tr ? "Ayak" : "Base")} value={isSeating ? form.quantity : form.legStyle} /><Summary label={tr ? "Ölçü" : "Dimensions"} value={form.dimensions} /><Summary label={tr ? "Yüzey" : "Finish"} value={form.finish} /></div><div className="quote-note"><strong>{tr ? "Bu bir fiyat teklifi talebidir." : "This is a quote request."}</strong><p>{tr ? "Ödeme alınmaz. Uygun ahşap plaka, fiyat ve teslim tarihi ekibimiz tarafından ayrıca netleştirilir." : "No payment is taken. Available slabs, price and delivery are confirmed separately by our team."}</p></div>{error && <p className="form-error">{error}</p>}</div>}
        <footer className="builder-actions"><button className="button ghost" disabled={step === 0 || sending} onClick={() => setStep((s) => s - 1)}><ChevronLeft />{tr ? "Geri" : "Back"}</button>{step < 5 ? <button className="button gold" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>{tr ? "Devam" : "Continue"}<ChevronRight /></button> : <button className="button gold" disabled={sending} onClick={submit}>{sending ? <LoaderCircle className="spin" /> : null}{tr ? "Talebi gönder" : "Send request"}</button>}</footer>
      </section>
    </div>
  );
}

function Choice({ title, value, onChange, options }: { title: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <div><h2>{title}</h2><div className="choice-grid">{options.map(([id, label, note]) => <button key={id} onClick={() => onChange(id)} className={value === id ? "selected" : ""}><span>{label}</span><small>{note}</small></button>)}</div></div>; }
function DetailChoice({ title, value, onChange, options }: { title: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <fieldset className="detail-choice-group"><legend>{title}</legend><div className="detail-choice-list" role="radiogroup" aria-label={title}>{options.map(([id, label]) => <button type="button" role="radio" aria-checked={value === id} className={value === id ? "selected" : ""} onClick={() => onChange(id)} key={id}><span>{label}</span>{value === id && <Check size={14} aria-hidden="true" />}</button>)}</div></fieldset>;
}
function Summary({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
