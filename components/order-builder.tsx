"use client";

import { Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { trees } from "@/lib/catalog";

type FormState = {
  productType: string; woodType: string; epoxy: string; legStyle: string; dimensions: string; finish: string;
  customerName: string; email: string; phone: string; city: string; notes: string; referenceUrl: string;
};

const initial: FormState = { productType: "dining-table", woodType: "olive", epoxy: "smoky-black", legStyle: "sculptural", dimensions: "220 × 100 × 76 cm", finish: "matte", customerName: "", email: "", phone: "", city: "", notes: "", referenceUrl: "" };

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
  const canContinue = useMemo(() => step < 4 || Boolean(form.customerName && form.email && form.phone && form.city), [step, form]);
  async function submit() {
    setSending(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, locale }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "failed");
      setResult(body);
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
          ["dining-table", tr ? "Yemek masası" : "Dining table", "220–300 cm"], ["coffee-table", tr ? "Orta sehpa" : "Coffee table", "90–150 cm"], ["desk", tr ? "Çalışma masası" : "Desk", "160–240 cm"], ["console", tr ? "Konsol" : "Console", "140–220 cm"], ["custom", tr ? "Özel tasarım" : "Custom piece", tr ? "Birlikte belirleyelim" : "Define together"]]} />}
        {step === 1 && <div><h2>{tr ? "Ağacınızı seçin" : "Choose your wood"}</h2><p className="form-lead">{tr ? "Her parça gerçek damar yapısı nedeniyle benzersizdir." : "Every slab is unique because of its natural grain."}</p><div className="wood-options">{trees.map((tree) => <button key={tree.id} className={form.woodType === tree.id ? "selected" : ""} onClick={() => update("woodType", tree.id)} style={{ "--wood": tree.tone } as React.CSSProperties}><i /><strong>{tr ? tree.tr : tree.en}</strong><span>{tr ? tree.traitTr : tree.traitEn}</span></button>)}</div></div>}
        {step === 2 && <div><h2>{tr ? "Yüzey ve konstrüksiyon" : "Surface and construction"}</h2><label className="field"><span>{tr ? "Epoksi" : "Resin"}</span><select value={form.epoxy} onChange={(e) => update("epoxy", e.target.value)}><option value="none">{tr ? "Epoksisiz" : "No resin"}</option><option value="clear">{tr ? "Şeffaf" : "Clear"}</option><option value="smoky-black">{tr ? "Füme siyah" : "Smoky black"}</option><option value="turquoise">{tr ? "Turkuaz" : "Turquoise"}</option><option value="custom">{tr ? "Özel renk" : "Custom color"}</option></select></label><label className="field"><span>{tr ? "Ayak modeli" : "Base style"}</span><select value={form.legStyle} onChange={(e) => update("legStyle", e.target.value)}><option value="sculptural">{tr ? "Heykelsi çelik" : "Sculptural steel"}</option><option value="u-frame">U Frame</option><option value="x-frame">X Frame</option><option value="wood">{tr ? "Masif ahşap" : "Solid wood"}</option></select></label><label className="field"><span>{tr ? "Yüzey" : "Finish"}</span><select value={form.finish} onChange={(e) => update("finish", e.target.value)}><option value="matte">{tr ? "Doğal mat" : "Natural matte"}</option><option value="satin">{tr ? "Saten" : "Satin"}</option><option value="gloss">{tr ? "Parlak" : "Gloss"}</option></select></label></div>}
        {step === 3 && <div><h2>{tr ? "Ölçülerinizi belirleyin" : "Set the dimensions"}</h2><label className="field"><span>{tr ? "Uzunluk × genişlik × yükseklik" : "Length × width × height"}</span><input value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="220 × 100 × 76 cm" /></label><label className="field"><span>{tr ? "İlham görseli bağlantısı (isteğe bağlı)" : "Reference image link (optional)"}</span><input type="url" value={form.referenceUrl} onChange={(e) => update("referenceUrl", e.target.value)} placeholder="https://" /></label><label className="field"><span>{tr ? "Özel notlar" : "Special notes"}</span><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={5} placeholder={tr ? "Kablo kanalı, çekmece, özel kenar…" : "Cable channel, drawer, edge treatment…"} /></label></div>}
        {step === 4 && <div><h2>{tr ? "Sizinle nasıl iletişim kuralım?" : "How should we reach you?"}</h2><div className="field-grid"><label className="field"><span>{tr ? "Ad soyad" : "Full name"}</span><input value={form.customerName} onChange={(e) => update("customerName", e.target.value)} /></label><label className="field"><span>E-mail</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value.toLowerCase())} /></label><label className="field"><span>{tr ? "Telefon" : "Phone"}</span><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label><label className="field"><span>{tr ? "Şehir" : "City"}</span><input value={form.city} onChange={(e) => update("city", e.target.value)} /></label></div><p className="privacy-note">{tr ? "Göndererek iletişim bilgilerinizin teklif hazırlamak amacıyla kullanılmasını kabul edersiniz. Bu işlem ödeme oluşturmaz." : "By submitting, you agree that your contact details may be used to prepare a quote. No payment is created."}</p></div>}
        {step === 5 && <div><h2>{tr ? "Tasarım özeti" : "Design summary"}</h2><div className="summary-grid"><Summary label={tr ? "Ürün" : "Product"} value={form.productType} /><Summary label={tr ? "Ağaç" : "Wood"} value={tr ? selectedTree.tr : selectedTree.en} /><Summary label={tr ? "Epoksi" : "Resin"} value={form.epoxy} /><Summary label={tr ? "Ayak" : "Base"} value={form.legStyle} /><Summary label={tr ? "Ölçü" : "Dimensions"} value={form.dimensions} /><Summary label={tr ? "Yüzey" : "Finish"} value={form.finish} /></div><div className="quote-note"><strong>{tr ? "Bu bir fiyat teklifi talebidir." : "This is a quote request."}</strong><p>{tr ? "Ödeme alınmaz. Uygun ahşap plaka, fiyat ve teslim tarihi ekibimiz tarafından ayrıca netleştirilir." : "No payment is taken. Available slabs, price and delivery are confirmed separately by our team."}</p></div>{error && <p className="form-error">{error}</p>}</div>}
        <footer className="builder-actions"><button className="button ghost" disabled={step === 0 || sending} onClick={() => setStep((s) => s - 1)}><ChevronLeft />{tr ? "Geri" : "Back"}</button>{step < 5 ? <button className="button gold" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>{tr ? "Devam" : "Continue"}<ChevronRight /></button> : <button className="button gold" disabled={sending} onClick={submit}>{sending ? <LoaderCircle className="spin" /> : null}{tr ? "Talebi gönder" : "Send request"}</button>}</footer>
      </section>
    </div>
  );
}

function Choice({ title, value, onChange, options }: { title: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <div><h2>{title}</h2><div className="choice-grid">{options.map(([id, label, note]) => <button key={id} onClick={() => onChange(id)} className={value === id ? "selected" : ""}><span>{label}</span><small>{note}</small></button>)}</div></div>; }
function Summary({ label, value }: { label: string; value: string }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
