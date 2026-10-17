"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import type { ChairModel, SetModel } from "@/lib/collection-data";

type Kind = "products" | "chairs" | "sets";
type Catalog = { products: Product[]; chairs: ChairModel[]; sets: SetModel[] };

const emptyCatalog: Catalog = { products: [], chairs: [], sets: [] };
const labels: Record<Kind, string> = { products: "Mobilyalar", chairs: "Sandalyeler", sets: "Setler" };

function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

function createItem(kind: Kind, position: number) {
  const id = `yeni-${kind}-${Date.now()}`;
  if (kind === "products") return { id, nameTr: "Yeni mobilya", nameEn: "New furniture", categoryTr: "Mobilya", categoryEn: "Furniture", category: "tables", wood: "walnut", epoxyTr: "Epoksisiz", epoxyEn: "No resin", dimensions: "Özel ölçü", image: "/images/real/natural-live-edge-table.jpeg", gallery: [], active: true } satisfies Product;
  if (kind === "chairs") return { id, name: "Yeni Sandalye", type: { tr: "Sandalye", en: "Chair" }, description: { tr: "Projeye göre özelleştirilen Wooden Universe modeli.", en: "A Wooden Universe model tailored to the project." }, colors: ["Naturel / Natural"], image: "/images/catalog/chairs/page-02.jpg", gallery: [], index: position + 1, active: true } satisfies ChairModel;
  return { id, name: "Yeni Set", kind: { tr: "Masa ve sandalye seti", en: "Table and chair set" }, sizes: "Özel ölçü", image: "/images/catalog/sets/page-35.jpg", gallery: [], capacity: { tr: "Projeye göre", en: "Project-specific" }, active: true } satisfies SetModel;
}

export function CatalogManager() {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog);
  const [kind, setKind] = useState<Kind>("products");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/catalog");
    if (response.ok) {
      const body = (await response.json()) as Catalog;
      setCatalog(body);
      setSelectedId((current) => current || body.products[0]?.id || "");
    } else setNotice("Katalog verisi yüklenemedi.");
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/catalog").then(async (response) => {
      if (cancelled) return;
      if (response.ok) {
        const body = (await response.json()) as Catalog;
        setCatalog(body);
        setSelectedId(body.products[0]?.id ?? "");
      } else setNotice("Katalog verisi yüklenemedi.");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);
  const items = catalog[kind];
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? items[0], [items, selectedId]);

  function chooseKind(next: Kind) {
    setKind(next);
    setSelectedId(catalog[next][0]?.id ?? "");
    setNotice("");
  }

  function updateItem(next: Product | ChairModel | SetModel) {
    setCatalog((current) => ({ ...current, [kind]: current[kind].map((item) => item.id === selected?.id ? next : item) } as Catalog));
    if (next.id !== selected?.id) setSelectedId(next.id);
  }

  function addItem() {
    const item = createItem(kind, items.length);
    setCatalog((current) => ({ ...current, [kind]: [...current[kind], item] } as Catalog));
    setSelectedId(item.id);
  }

  function removeItem() {
    if (!selected || !window.confirm(`“${"name" in selected ? selected.name : selected.nameTr}” kaydını silmek istiyor musunuz?`)) return;
    const next = items.filter((item) => item.id !== selected.id);
    setCatalog((current) => ({ ...current, [kind]: next } as Catalog));
    setSelectedId(next[0]?.id ?? "");
  }

  function move(direction: -1 | 1) {
    if (!selected) return;
    const from = items.findIndex((item) => item.id === selected.id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    if (kind === "chairs") (next as ChairModel[]).forEach((item, index) => { item.index = index + 1; });
    setCatalog((current) => ({ ...current, [kind]: next } as Catalog));
  }

  async function save() {
    setSaving(true); setNotice("");
    const response = await fetch("/api/admin/catalog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, items }) });
    setSaving(false);
    setNotice(response.ok ? `${labels[kind]} kaydedildi ve siteye yansıtıldı.` : "Katalog kaydedilemedi. Alanları kontrol edin.");
    if (response.ok) await load();
  }

  if (loading) return <div className="catalog-loading"><LoaderCircle className="spin" /> Katalog hazırlanıyor…</div>;
  return <section className="admin-card catalog-manager">
    <div className="card-heading"><div><h2>Katalog yönetimi</h2><p>Ürünleri düzenleyin, sıralayın, pasife alın veya yeni kayıt ekleyin.</p></div><button className="button gold" onClick={save} disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}Tümünü kaydet</button></div>
    {notice && <div className="admin-notice">{notice}</div>}
    <div className="catalog-kind-tabs">{(Object.keys(labels) as Kind[]).map((item) => <button key={item} className={kind === item ? "active" : ""} onClick={() => chooseKind(item)}>{labels[item]} <span>{catalog[item].length}</span></button>)}</div>
    <div className="catalog-editor-layout">
      <aside className="catalog-list"><button className="catalog-add" onClick={addItem}><Plus /> Yeni kayıt</button>{items.map((item, index) => <button key={item.id} className={selected?.id === item.id ? "active" : ""} onClick={() => setSelectedId(item.id)}><img src={item.image} alt="" /><span><strong>{"name" in item ? item.name : item.nameTr}</strong><small>{String(index + 1).padStart(2, "0")} · {item.active === false ? "Pasif" : "Yayında"}</small></span></button>)}</aside>
      <div className="catalog-form">{!selected ? <div className="empty-state">Bu koleksiyonda kayıt yok.</div> : <>
        <div className="catalog-form-toolbar"><button onClick={() => move(-1)} title="Yukarı taşı"><ArrowUp /></button><button onClick={() => move(1)} title="Aşağı taşı"><ArrowDown /></button><button onClick={() => updateItem({ ...selected, active: selected.active === false } as typeof selected)}>{selected.active === false ? <Eye /> : <EyeOff />}{selected.active === false ? "Yayınla" : "Pasife al"}</button><button className="danger" onClick={removeItem}><Trash2 />Sil</button></div>
        {kind === "products" ? <ProductFields item={selected as Product} onChange={updateItem} /> : kind === "chairs" ? <ChairFields item={selected as ChairModel} onChange={updateItem} /> : <SetFields item={selected as SetModel} onChange={updateItem} />}
      </>}</div>
    </div>
  </section>;
}

function BaseFields({ item, onChange }: { item: Product | ChairModel | SetModel; onChange: (item: Product | ChairModel | SetModel) => void }) {
  return <><Field label="Kayıt adresi (slug)"><input value={item.id} onChange={(event) => onChange({ ...item, id: slugify(event.target.value) })} /></Field><Field label="Kapak görseli"><input value={item.image} onChange={(event) => onChange({ ...item, image: event.target.value })} placeholder="/images/... veya yüklenen görsel adresi" /></Field><Field label="Galeri görselleri"><textarea rows={4} value={(item.gallery ?? []).join("\n")} onChange={(event) => onChange({ ...item, gallery: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) })} placeholder="Her satıra bir görsel adresi" /></Field></>;
}

function ProductFields({ item, onChange }: { item: Product; onChange: (item: Product) => void }) {
  const set = (patch: Partial<Product>) => onChange({ ...item, ...patch });
  return <div className="catalog-fields"><div className="field-grid"><Field label="Türkçe ürün adı"><input value={item.nameTr} onChange={(e) => set({ nameTr: e.target.value })} /></Field><Field label="English product name"><input value={item.nameEn} onChange={(e) => set({ nameEn: e.target.value })} /></Field><Field label="Türkçe kategori"><input value={item.categoryTr} onChange={(e) => set({ categoryTr: e.target.value })} /></Field><Field label="English category"><input value={item.categoryEn} onChange={(e) => set({ categoryEn: e.target.value })} /></Field><Field label="Kategori kodu"><input value={item.category ?? ""} onChange={(e) => set({ category: slugify(e.target.value) })} placeholder="tables, consoles…" /></Field><Field label="Ağaç kodu"><select value={item.wood} onChange={(e) => set({ wood: e.target.value })}>{["olive","beech","pine","walnut","chestnut","oak","ash","iroko","sapele","sipo"].map((wood) => <option key={wood}>{wood}</option>)}</select></Field><Field label="Türkçe yüzey/epoksi"><input value={item.epoxyTr} onChange={(e) => set({ epoxyTr: e.target.value })} /></Field><Field label="English finish/resin"><input value={item.epoxyEn} onChange={(e) => set({ epoxyEn: e.target.value })} /></Field><Field label="Ölçü"><input value={item.dimensions} onChange={(e) => set({ dimensions: e.target.value })} /></Field></div><BaseFields item={item} onChange={(value) => onChange(value as Product)} /></div>;
}

function ChairFields({ item, onChange }: { item: ChairModel; onChange: (item: ChairModel) => void }) {
  const set = (patch: Partial<ChairModel>) => onChange({ ...item, ...patch });
  return <div className="catalog-fields"><div className="field-grid"><Field label="Model adı"><input value={item.name} onChange={(e) => set({ name: e.target.value })} /></Field><Field label="Sıra"><input type="number" min="1" value={item.index} onChange={(e) => set({ index: Number(e.target.value) })} /></Field><Field label="Türkçe tür"><input value={item.type.tr} onChange={(e) => set({ type: { ...item.type, tr: e.target.value } })} /></Field><Field label="English type"><input value={item.type.en} onChange={(e) => set({ type: { ...item.type, en: e.target.value } })} /></Field><Field label="Türkçe açıklama"><textarea rows={3} value={item.description.tr} onChange={(e) => set({ description: { ...item.description, tr: e.target.value } })} /></Field><Field label="English description"><textarea rows={3} value={item.description.en} onChange={(e) => set({ description: { ...item.description, en: e.target.value } })} /></Field><Field label="Renkler"><textarea rows={3} value={item.colors.join("\n")} onChange={(e) => set({ colors: e.target.value.split("\n").filter(Boolean) })} /></Field></div><BaseFields item={item} onChange={(value) => onChange(value as ChairModel)} /></div>;
}

function SetFields({ item, onChange }: { item: SetModel; onChange: (item: SetModel) => void }) {
  const set = (patch: Partial<SetModel>) => onChange({ ...item, ...patch });
  return <div className="catalog-fields"><div className="field-grid"><Field label="Set adı"><input value={item.name} onChange={(e) => set({ name: e.target.value })} /></Field><Field label="Ölçüler"><input value={item.sizes} onChange={(e) => set({ sizes: e.target.value })} /></Field><Field label="Türkçe tür"><input value={item.kind.tr} onChange={(e) => set({ kind: { ...item.kind, tr: e.target.value } })} /></Field><Field label="English type"><input value={item.kind.en} onChange={(e) => set({ kind: { ...item.kind, en: e.target.value } })} /></Field><Field label="Türkçe kapasite"><input value={item.capacity.tr} onChange={(e) => set({ capacity: { ...item.capacity, tr: e.target.value } })} /></Field><Field label="English capacity"><input value={item.capacity.en} onChange={(e) => set({ capacity: { ...item.capacity, en: e.target.value } })} /></Field></div><BaseFields item={item} onChange={(value) => onChange(value as SetModel)} /></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }
