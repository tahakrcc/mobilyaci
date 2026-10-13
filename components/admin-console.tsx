"use client";

import { ImagePlus, LayoutDashboard, LoaderCircle, Package, Save, Settings2, Upload, Languages } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { orderStatuses } from "@/lib/catalog";

type Order = { id: string; orderNumber: string; customerName: string; email: string; phone: string; city: string; productType: string; woodType: string; epoxy: string; dimensions: string; status: string; createdAt: string; notificationStatus: string };
type ContentRow = { id: string; key: string; locale: "tr" | "en"; type: string; value: string };
const fields = [
  ["hero.title", "Hero başlığı", "text"], ["hero.subtitle", "Hero açıklaması", "textarea"], ["hero.image", "Hero görsel URL", "image"],
  ["story.title", "3D bölüm başlığı", "text"], ["story.body", "3D bölüm açıklaması", "textarea"], ["products.title", "Koleksiyon başlığı", "text"],
  ["process.title", "Süreç başlığı", "text"], ["cta.title", "Alt çağrı başlığı", "text"], ["footer.text", "Alt bilgi", "textarea"],
  ["about.title", "Hakkımızda başlığı", "text"], ["about.body", "Hakkımızda açıklaması", "textarea"],
  ["workshop.title", "Atölye başlığı", "text"], ["workshop.body", "Atölye açıklaması", "textarea"],
  ["contact.title", "İletişim başlığı", "text"], ["contact.body", "İletişim açıklaması", "textarea"],
  ["projects.title", "Projeler başlığı", "text"], ["projects.body", "Projeler açıklaması", "textarea"],
  ["woods.title", "Ağaçlar başlığı", "text"], ["woods.body", "Ağaçlar açıklaması", "textarea"],
] as const;

export function AdminConsole({ userName }: { userName: string }) {
  const [tab, setTab] = useState<"dashboard" | "orders" | "content" | "media">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    const [orderResponse, contentResponse] = await Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/content")]);
    if (orderResponse.ok) setOrders((await orderResponse.json()).orders);
    if (contentResponse.ok) setContent((await contentResponse.json()).content);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  async function saveContent(key: string, type: string, value: string) {
    setSaving(`${locale}:${key}`); setNotice("");
    const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, locale, type, value }) });
    setSaving("");
    if (response.ok) { setNotice("İçerik kaydedildi."); await load(); } else setNotice("Kaydetme başarısız.");
  }
  async function updateOrder(order: Order, status: string) {
    setSaving(order.id);
    const response = await fetch(`/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, publicNote: `Sipariş durumu güncellendi: ${orderStatuses.find((item) => item.id === status)?.tr ?? status}`, internalNote: "" }) });
    if (response.ok) await load();
    setSaving("");
  }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving("media"); setNotice("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(form) });
    const body = await response.json();
    if (response.ok) { setNotice(`Görsel yüklendi: ${body.url}`); form.reset(); } else setNotice("Görsel yüklenemedi.");
    setSaving("");
  }
  const newOrders = orders.filter((item) => item.status === "received").length;
  const production = orders.filter((item) => ["material", "production", "epoxy", "finishing", "quality"].includes(item.status)).length;
  return <div className="admin-shell">
    <aside className="admin-sidebar"><div className="brand admin-brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div><nav><button onClick={() => setTab("dashboard")} className={tab === "dashboard" ? "active" : ""}><LayoutDashboard />Genel Bakış</button><button onClick={() => setTab("orders")} className={tab === "orders" ? "active" : ""}><Package />Siparişler <em>{newOrders}</em></button><button onClick={() => setTab("content")} className={tab === "content" ? "active" : ""}><Languages />İçerik ve Çeviri</button><button onClick={() => setTab("media")} className={tab === "media" ? "active" : ""}><ImagePlus />Medya</button><a href="/tr" target="_blank"><Settings2 />Siteyi görüntüle</a></nav><small>{userName}</small></aside>
    <main className="admin-main"><header><div><p className="eyebrow">WOODENUNIVERSE STUDIO</p><h1>{tab === "dashboard" ? "Genel Bakış" : tab === "orders" ? "Sipariş Yönetimi" : tab === "content" ? "İçerik ve Çeviri" : "Medya Kütüphanesi"}</h1></div>{loading && <LoaderCircle className="spin" />}</header>{notice && <div className="admin-notice">{notice}</div>}
      {tab === "dashboard" && <><div className="stat-grid"><Stat label="Toplam talep" value={orders.length} /><Stat label="Yeni talep" value={newOrders} /><Stat label="Üretimde" value={production} /><Stat label="Tamamlanan" value={orders.filter((item) => item.status === "delivered").length} /></div><section className="admin-card"><h2>Son talepler</h2><OrderTable orders={orders.slice(0, 6)} saving={saving} updateOrder={updateOrder} /></section></>}
      {tab === "orders" && <section className="admin-card"><div className="card-heading"><div><h2>Tüm sipariş talepleri</h2><p>Durum değişiklikleri müşterinin takip ekranına işlenir.</p></div></div><OrderTable orders={orders} saving={saving} updateOrder={updateOrder} /></section>}
      {tab === "content" && <section className="admin-card"><div className="card-heading"><div><h2>Sayfa içeriği</h2><p>Boş bırakılan alanlar sitenin varsayılan metnini kullanır. Değişiklikler sayfa yenilendiğinde görünür.</p></div><div className="locale-tabs"><button className={locale === "tr" ? "active" : ""} onClick={() => setLocale("tr")}>TR</button><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button></div></div><div className="content-editor">{fields.map(([key, label, type]) => { const row = content.find((item) => item.key === key && item.locale === locale); return <ContentField key={`${locale}:${key}`} fieldKey={key} label={label} type={type} initial={row?.value ?? ""} saving={saving === `${locale}:${key}`} onSave={saveContent} />; })}</div></section>}
      {tab === "media" && <section className="admin-card media-panel"><h2>Yeni görsel yükle</h2><p>Yüklenen görselin adresini içerik alanlarında veya sipariş güncellemelerinde kullanabilirsiniz.</p><form onSubmit={upload}><label className="upload-zone"><Upload /><strong>Görsel seçin</strong><span>PNG, JPG veya WebP · en fazla 8 MB</span><input name="file" type="file" accept="image/*" required /></label><div className="field-grid"><label className="field"><span>Türkçe alternatif metin</span><input name="altTr" /></label><label className="field"><span>English alt text</span><input name="altEn" /></label></div><button className="button gold" disabled={saving === "media"}>{saving === "media" ? <LoaderCircle className="spin" /> : <Upload />}Yükle</button></form></section>}
    </main>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="stat-card"><small>{label}</small><strong>{String(value).padStart(2, "0")}</strong></div>; }
function OrderTable({ orders, saving, updateOrder }: { orders: Order[]; saving: string; updateOrder: (order: Order, status: string) => void }) { if (!orders.length) return <div className="empty-state">Henüz sipariş talebi bulunmuyor.</div>; return <div className="table-wrap"><table><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Tasarım</th><th>Tarih</th><th>Durum</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.orderNumber}</strong><small>{order.city}</small></td><td>{order.customerName}<small>{order.email}<br />{order.phone}</small></td><td>{order.productType}<small>{order.woodType} · {order.dimensions}</small></td><td>{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td><td><select value={order.status} disabled={saving === order.id} onChange={(e) => updateOrder(order, e.target.value)}>{orderStatuses.map((status) => <option key={status.id} value={status.id}>{status.tr}</option>)}</select></td></tr>)}</tbody></table></div>; }
function ContentField({ fieldKey, label, type, initial, saving, onSave }: { fieldKey: string; label: string; type: string; initial: string; saving: boolean; onSave: (key: string, type: string, value: string) => void }) { const [value, setValue] = useState(initial); useEffect(() => setValue(initial), [initial]); return <div className="content-field"><label><span>{label}</span><small>{fieldKey}</small></label>{type === "textarea" ? <textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} /> : <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "image" ? "/api/media/..." : "Varsayılan içeriği kullan"} />}<button onClick={() => onSave(fieldKey, type, value)} disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}</button></div>; }
