"use client";

import { SiteImage } from "@/components/site-image";

import { ChevronDown, Copy, ImagePlus, LayoutDashboard, LoaderCircle, Package, PackageOpen, Save, Settings2, Trash2, Upload, Languages } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { orderStatuses } from "@/lib/catalog";
import { CatalogManager } from "@/components/catalog-manager";

type Order = { id: string; orderNumber: string; customerName: string; email: string; phone: string; city: string; productType: string; woodType: string; epoxy: string; dimensions: string; status: string; createdAt: string; notificationStatus: string; estimatedDelivery: string | null; quotedAmount: number | null; notes: string; adminNotes: string };
type OrderUpdate = { status: string; publicNote?: string; internalNote?: string; estimatedDelivery?: string | null; quotedAmount?: number | null; mediaUrl?: string | null };
type ContentRow = { id: string; key: string; locale: "tr" | "en"; type: string; value: string };
type MediaRow = { id: string; filename: string; url: string; altTr: string; altEn: string; createdAt: string };
type SystemStatus = { database: { configured: boolean; ok: boolean; counts?: Record<string, number> }; storage: { configured: boolean }; email: { configured: boolean; senderConfigured: boolean }; admin: { configured: boolean } };
const fields = [
  ["hero.title", "Hero başlığı", "text"], ["hero.subtitle", "Hero açıklaması", "textarea"], ["hero.image", "Hero görsel URL", "image"],
  ["story.title", "3D bölüm başlığı", "text"], ["story.body", "3D bölüm açıklaması", "textarea"], ["products.title", "Koleksiyon başlığı", "text"],
  ["process.title", "Süreç başlığı", "text"], ["cta.title", "Alt çağrı başlığı", "text"], ["footer.text", "Alt bilgi", "textarea"],
  ["about.title", "Hakkımızda başlığı", "text"], ["about.body", "Hakkımızda açıklaması", "textarea"],
  ["workshop.title", "Atölye başlığı", "text"], ["workshop.body", "Atölye açıklaması", "textarea"],
  ["contact.title", "İletişim başlığı", "text"], ["contact.body", "İletişim açıklaması", "textarea"],
  ["projects.title", "Projeler başlığı", "text"], ["projects.body", "Projeler açıklaması", "textarea"],
  ["woods.title", "Ağaçlar başlığı", "text"], ["woods.body", "Ağaçlar açıklaması", "textarea"],
  ["furniture.title", "Mobilya başlığı", "text"], ["furniture.body", "Mobilya açıklaması", "textarea"],
  ["chairs.title", "Sandalyeler başlığı", "text"], ["chairs.body", "Sandalyeler açıklaması", "textarea"], ["chairs.image", "Sandalyeler kapak görseli", "image"],
  ["sets.title", "Setler başlığı", "text"], ["sets.body", "Setler açıklaması", "textarea"], ["sets.image", "Setler kapak görseli", "image"],
] as const;

export function AdminConsole({ userName }: { userName: string }) {
  const [tab, setTab] = useState<"dashboard" | "orders" | "catalog" | "content" | "media">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [content, setContent] = useState<ContentRow[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    const [orderResponse, contentResponse, mediaResponse, systemResponse] = await Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/content"), fetch("/api/admin/media"), fetch("/api/admin/system")]);
    if (orderResponse.ok) setOrders(((await orderResponse.json()) as { orders: Order[] }).orders);
    if (contentResponse.ok) setContent(((await contentResponse.json()) as { content: ContentRow[] }).content);
    if (mediaResponse.ok) setMedia(((await mediaResponse.json()) as { media: MediaRow[] }).media);
    if (systemResponse.ok) setSystem((await systemResponse.json()) as SystemStatus);
    setLoading(false);
  }
  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetch("/api/admin/orders"), fetch("/api/admin/content"), fetch("/api/admin/media"), fetch("/api/admin/system")]).then(async ([orderResponse, contentResponse, mediaResponse, systemResponse]) => {
      if (cancelled) return;
      if (orderResponse.ok) setOrders(((await orderResponse.json()) as { orders: Order[] }).orders);
      if (contentResponse.ok) setContent(((await contentResponse.json()) as { content: ContentRow[] }).content);
      if (mediaResponse.ok) setMedia(((await mediaResponse.json()) as { media: MediaRow[] }).media);
      if (systemResponse.ok) setSystem((await systemResponse.json()) as SystemStatus);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);
  async function saveContent(key: string, type: string, value: string) {
    setSaving(`${locale}:${key}`); setNotice("");
    const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, locale, type, value }) });
    setSaving("");
    if (response.ok) { setNotice("İçerik kaydedildi."); await load(); } else setNotice("Kaydetme başarısız.");
  }
  async function updateOrder(order: Order, update: OrderUpdate) {
    setSaving(order.id);
    const response = await fetch(`/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(update) });
    if (response.ok) await load();
    setSaving("");
  }
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving("media"); setNotice("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(form) });
    const body = (await response.json()) as { url?: string };
    if (response.ok) { setNotice(`Görsel yüklendi: ${body.url}`); form.reset(); await load(); } else setNotice("Görsel yüklenemedi.");
    setSaving("");
  }
  async function updateMedia(item: MediaRow, altTr: string, altEn: string) {
    setSaving(item.id); setNotice("");
    const response = await fetch("/api/admin/media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, altTr, altEn }) });
    setSaving("");
    if (response.ok) { setNotice("Alternatif metinler kaydedildi."); await load(); } else setNotice("Alternatif metinler kaydedilemedi.");
  }
  async function deleteMedia(item: MediaRow) {
    if (!window.confirm(`“${item.filename}” görselini silmek istiyor musunuz?`)) return;
    setSaving(item.id); setNotice("");
    const response = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
    const body = (await response.json()) as { error?: string };
    setSaving("");
    if (response.ok) { setNotice("Görsel silindi."); await load(); }
    else setNotice(body.error === "in-use" ? "Bu görsel katalogda kullanıldığı için silinmedi." : "Görsel silinemedi.");
  }
  async function setupDatabase() {
    setSaving("database"); setNotice("");
    const response = await fetch("/api/admin/setup", { method: "POST" });
    setSaving("");
    if (response.ok) { setNotice("Neon tabloları hazırlandı."); await load(); }
    else setNotice("Neon tabloları hazırlanamadı. Vercel günlüklerini kontrol edin.");
  }
  const newOrders = orders.filter((item) => item.status === "received").length;
  const production = orders.filter((item) => ["material", "production", "epoxy", "finishing", "quality"].includes(item.status)).length;
  return <div className="admin-shell">
    <aside className="admin-sidebar"><div className="brand admin-brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div><nav><button onClick={() => setTab("dashboard")} className={tab === "dashboard" ? "active" : ""}><LayoutDashboard />Genel Bakış</button><button onClick={() => setTab("orders")} className={tab === "orders" ? "active" : ""}><Package />Siparişler <em>{newOrders}</em></button><button onClick={() => setTab("catalog")} className={tab === "catalog" ? "active" : ""}><PackageOpen />Katalog</button><button onClick={() => setTab("content")} className={tab === "content" ? "active" : ""}><Languages />İçerik ve Çeviri</button><button onClick={() => setTab("media")} className={tab === "media" ? "active" : ""}><ImagePlus />Medya</button><a href="/tr" target="_blank"><Settings2 />Siteyi görüntüle</a><form action="/api/admin/logout" method="post"><button type="submit">Çıkış yap</button></form></nav><small>{userName}</small></aside>
    <main className="admin-main"><header><div><p className="eyebrow">WOODENUNIVERSE STUDIO</p><h1>{tab === "dashboard" ? "Genel Bakış" : tab === "orders" ? "Sipariş Yönetimi" : tab === "catalog" ? "Katalog Yönetimi" : tab === "content" ? "İçerik ve Çeviri" : "Medya Kütüphanesi"}</h1></div>{loading && <LoaderCircle className="spin" />}</header>{notice && <div className="admin-notice" role="status" aria-live="polite">{notice}</div>}
      {tab === "dashboard" && <><div className="stat-grid"><Stat label="Toplam talep" value={orders.length} /><Stat label="Yeni talep" value={newOrders} /><Stat label="Üretimde" value={production} /><Stat label="Tamamlanan" value={orders.filter((item) => item.status === "delivered").length} /></div><SystemPanel system={system} settingUp={saving === "database"} onSetup={setupDatabase} /><section className="admin-card"><h2>Son talepler</h2><OrderTable orders={orders.slice(0, 6)} saving={saving} updateOrder={updateOrder} /></section></>}
      {tab === "orders" && <section className="admin-card"><div className="card-heading"><div><h2>Tüm sipariş talepleri</h2><p>Durum değişiklikleri müşterinin takip ekranına işlenir.</p></div></div><OrderTable orders={orders} saving={saving} updateOrder={updateOrder} /></section>}
      {tab === "catalog" && <CatalogManager />}
      {tab === "content" && <section className="admin-card"><div className="card-heading"><div><h2>Sayfa içeriği</h2><p>Boş bırakılan alanlar sitenin varsayılan metnini kullanır. Değişiklikler sayfa yenilendiğinde görünür.</p></div><div className="locale-tabs"><button className={locale === "tr" ? "active" : ""} onClick={() => setLocale("tr")}>TR</button><button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button></div></div><div className="content-editor">{fields.map(([key, label, type]) => { const row = content.find((item) => item.key === key && item.locale === locale); return <ContentField key={`${locale}:${key}:${row?.value ?? "default"}`} fieldKey={key} label={label} type={type} initial={row?.value ?? ""} saving={saving === `${locale}:${key}`} onSave={saveContent} />; })}</div></section>}
      {tab === "media" && <section className="admin-card media-panel"><h2>Yeni görsel yükle</h2><p>Yüklenen görselin adresini katalogdaki kapak veya galeri alanlarına yapıştırabilirsiniz.</p><form onSubmit={upload}><label className="upload-zone"><Upload /><strong>Görsel seçin</strong><span>PNG, JPG, WebP veya AVIF · en fazla 4 MB</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required /></label><div className="field-grid"><label className="field"><span>Türkçe alternatif metin</span><input name="altTr" /></label><label className="field"><span>English alt text</span><input name="altEn" /></label></div><button className="button gold" disabled={saving === "media"}>{saving === "media" ? <LoaderCircle className="spin" /> : <Upload />}Yükle</button></form><div className="media-library"><div className="card-heading"><div><h2>Medya kütüphanesi</h2><p>{media.length} görsel · Metinleri düzenleyebilir, adresi kopyalayabilir veya kullanılmayan görseli silebilirsiniz.</p></div></div>{media.length ? <div className="media-grid">{media.map((item) => <MediaEditor key={item.id} item={item} saving={saving === item.id} onSave={updateMedia} onDelete={deleteMedia} onNotice={setNotice} />)}</div> : <div className="empty-state">Henüz yüklenmiş görsel bulunmuyor.</div>}</div></section>}
    </main>
  </div>;
}

function MediaEditor({ item, saving, onSave, onDelete, onNotice }: { item: MediaRow; saving: boolean; onSave: (item: MediaRow, altTr: string, altEn: string) => void; onDelete: (item: MediaRow) => void; onNotice: (message: string) => void }) {
  const [altTr, setAltTr] = useState(item.altTr);
  const [altEn, setAltEn] = useState(item.altEn);
  return <article className="media-editor"><button className="media-preview" type="button" title="Görsel adresini kopyala" onClick={async () => { await navigator.clipboard.writeText(item.url); onNotice("Görsel adresi kopyalandı."); }}><SiteImage src={item.url} alt={altTr || item.filename} /><span><Copy size={14} />{item.filename}</span></button><label><span>Türkçe alternatif metin</span><input value={altTr} onChange={(event) => setAltTr(event.target.value)} /></label><label><span>English alt text</span><input value={altEn} onChange={(event) => setAltEn(event.target.value)} /></label><div className="media-actions"><button type="button" onClick={() => onSave(item, altTr, altEn)} disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />} Kaydet</button><button type="button" className="danger" onClick={() => onDelete(item)} disabled={saving}><Trash2 /> Sil</button></div></article>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="stat-card"><small>{label}</small><strong>{String(value).padStart(2, "0")}</strong></div>; }
function SystemPanel({ system, settingUp, onSetup }: { system: SystemStatus | null; settingUp: boolean; onSetup: () => void }) {
  const items = [
    { label: "Neon veritabanı", ok: Boolean(system?.database.ok), note: system?.database.ok ? `${system.database.counts?.orders ?? 0} sipariş · ${system.database.counts?.media ?? 0} medya` : system?.database.configured ? "Bağlantı veya tablolar kontrol edilmeli" : "Bağlı değil" },
    { label: "Vercel Blob", ok: Boolean(system?.storage.configured), note: system?.storage.configured ? "Görsel yüklemeye hazır" : "Token eksik" },
    { label: "E-posta", ok: Boolean(system?.email.configured), note: system?.email.configured ? (system.email.senderConfigured ? "Özel gönderici hazır" : "Resend test göndericisi") : "Resend veya alıcı eksik" },
    { label: "Yönetici güvenliği", ok: Boolean(system?.admin.configured), note: system?.admin.configured ? "Oturum yapılandırıldı" : "Ayar eksik" },
  ];
  return <section className="admin-card system-panel"><div className="card-heading"><div><h2>Sistem durumu</h2><p>Gizli değerler gösterilmeden üretim bağlantıları kontrol edilir.</p></div>{system?.database.configured && !system.database.ok && <button className="button gold" onClick={onSetup} disabled={settingUp}>{settingUp ? <LoaderCircle className="spin" /> : <Settings2 />}Neon tablolarını hazırla</button>}</div><div className="system-grid">{items.map((item) => <div key={item.label}><i className={item.ok ? "ok" : "warn"} /><span><strong>{item.label}</strong><small>{item.note}</small></span></div>)}</div></section>;
}
function OrderTable({ orders, saving, updateOrder }: { orders: Order[]; saving: string; updateOrder: (order: Order, update: OrderUpdate) => void }) {
  const [expanded, setExpanded] = useState("");
  if (!orders.length) return <div className="empty-state">Henüz sipariş talebi bulunmuyor.</div>;
  return <div className="table-wrap"><table><thead><tr><th>Sipariş</th><th>Müşteri</th><th>Tasarım</th><th>Tarih</th><th>Durum</th><th /></tr></thead><tbody>{orders.map((order) => <OrderRows key={order.id} order={order} expanded={expanded === order.id} saving={saving === order.id} onToggle={() => setExpanded(expanded === order.id ? "" : order.id)} updateOrder={updateOrder} />)}</tbody></table></div>;
}
function OrderRows({ order, expanded, saving, onToggle, updateOrder }: { order: Order; expanded: boolean; saving: boolean; onToggle: () => void; updateOrder: (order: Order, update: OrderUpdate) => void }) {
  const [publicNote, setPublicNote] = useState("");
  const [internalNote, setInternalNote] = useState(order.adminNotes ?? "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(order.estimatedDelivery ?? "");
  const [quotedAmount, setQuotedAmount] = useState(order.quotedAmount?.toString() ?? "");
  const [mediaUrl, setMediaUrl] = useState("");
  const changeStatus = (status: string) => updateOrder(order, { status, publicNote: `Sipariş durumu güncellendi: ${orderStatuses.find((item) => item.id === status)?.tr ?? status}` });
  return <><tr><td><strong>{order.orderNumber}</strong><small>{order.city}</small></td><td>{order.customerName}<small>{order.email}<br />{order.phone}</small></td><td>{order.productType}<small>{order.woodType} · {order.dimensions}</small></td><td>{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td><td><select value={order.status} disabled={saving} onChange={(e) => changeStatus(e.target.value)}>{orderStatuses.map((status) => <option key={status.id} value={status.id}>{status.tr}</option>)}</select></td><td><button className={expanded ? "order-expand active" : "order-expand"} onClick={onToggle} aria-label="Sipariş ayrıntıları"><ChevronDown /></button></td></tr>{expanded && <tr className="order-editor-row"><td colSpan={6}><div className="order-editor"><div className="order-brief"><small>MÜŞTERİ NOTU</small><p>{order.notes || "Not bırakılmamış."}</p><small>BİLDİRİM</small><p>{order.notificationStatus}</p></div><div className="order-editor-fields"><label><span>Müşteriye görünen açıklama</span><textarea rows={3} value={publicNote} onChange={(e) => setPublicNote(e.target.value)} placeholder="Örn. Tabla zımpara aşamasına geçti." /></label><label><span>Dahili atölye notu</span><textarea rows={3} value={internalNote} onChange={(e) => setInternalNote(e.target.value)} /></label><label><span>Tahmini teslim</span><input value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} placeholder="Örn. 15–20 Kasım" /></label><label><span>Teklif tutarı (₺)</span><input type="number" min="0" value={quotedAmount} onChange={(e) => setQuotedAmount(e.target.value)} /></label><label className="wide"><span>Üretim fotoğrafı adresi</span><input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Medya kütüphanesinden bir adres yapıştırın" /></label><button className="button gold" disabled={saving} onClick={() => updateOrder(order, { status: order.status, publicNote, internalNote, estimatedDelivery: estimatedDelivery || null, quotedAmount: quotedAmount ? Number(quotedAmount) : null, mediaUrl: mediaUrl || null })}>{saving ? <LoaderCircle className="spin" /> : <Save />}Güncellemeyi kaydet</button></div></div></td></tr>}</>;
}
function ContentField({ fieldKey, label, type, initial, saving, onSave }: { fieldKey: string; label: string; type: string; initial: string; saving: boolean; onSave: (key: string, type: string, value: string) => void }) { const [value, setValue] = useState(initial); return <div className="content-field"><label><span>{label}</span><small>{fieldKey}</small></label>{type === "textarea" ? <textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} /> : <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "image" ? "Vercel Blob görsel adresi" : "Varsayılan içeriği kullan"} />}<button onClick={() => onSave(fieldKey, type, value)} disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}</button></div>; }
