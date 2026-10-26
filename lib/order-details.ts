import { trees, type Locale } from "@/lib/catalog";

type Choice = "productType" | "epoxy" | "legStyle" | "finish" | "upholstery";
type Labels = Record<string, { tr: string; en: string }>;

const labels: Record<Choice, Labels> = {
  productType: {
    "tv-unit": { tr: "TV ünitesi", en: "TV unit" },
    console: { tr: "Konsol", en: "Console" },
    "coffee-corner": { tr: "Kahve köşesi", en: "Coffee corner" },
    "dining-table": { tr: "Yemek masası", en: "Dining table" },
    "coffee-table": { tr: "Orta sehpa", en: "Coffee table" },
    desk: { tr: "Çalışma masası", en: "Desk" },
    chair: { tr: "Sandalye", en: "Chair" },
    "bar-chair": { tr: "Bar sandalyesi", en: "Bar chair" },
    set: { tr: "Masa ve sandalye seti", en: "Table and chair set" },
    bookcase: { tr: "Kitaplık", en: "Bookcase" },
    "bar-unit": { tr: "Bar ünitesi", en: "Bar unit" },
    custom: { tr: "Özel tasarım", en: "Custom piece" },
  },
  epoxy: {
    none: { tr: "Epoksisiz", en: "No resin" },
    clear: { tr: "Şeffaf", en: "Clear" },
    "smoky-black": { tr: "Füme siyah", en: "Smoky black" },
    turquoise: { tr: "Turkuaz", en: "Turquoise" },
    custom: { tr: "Özel renk", en: "Custom color" },
  },
  legStyle: {
    sculptural: { tr: "Heykelsi çelik", en: "Sculptural steel" },
    "u-frame": { tr: "U çerçeve", en: "U frame" },
    "x-frame": { tr: "X çerçeve", en: "X frame" },
    wood: { tr: "Masif ahşap", en: "Solid wood" },
  },
  finish: {
    matte: { tr: "Doğal mat", en: "Natural matte" },
    satin: { tr: "Saten", en: "Satin" },
    gloss: { tr: "Parlak", en: "Gloss" },
  },
  upholstery: {
    "project-fabric": { tr: "Proje kumaşı", en: "Project fabric" },
    leather: { tr: "Deri", en: "Leather" },
    boucle: { tr: "Bukle", en: "Bouclé" },
    "customer-choice": { tr: "Birlikte seçelim", en: "Choose together" },
  },
};

export type OrderDetail = { label: string; value: string };

export type OrderSelections = {
  productType: string;
  woodType: string;
  epoxy: string;
  legStyle: string;
  dimensions: string;
  finish: string;
  notes?: string;
  upholstery?: string;
  quantity?: string;
};

export function orderChoiceLabel(choice: Choice | "woodType", value: string, locale: Locale) {
  if (choice === "woodType") {
    const tree = trees.find((item) => item.id === value);
    return tree ? tree[locale] : value;
  }
  return labels[choice][value]?.[locale] ?? value;
}

export function orderDetailRows(order: OrderSelections, locale: Locale): OrderDetail[] {
  const tr = locale === "tr";
  const seating = ["chair", "bar-chair", "set"].includes(order.productType);
  const rows: OrderDetail[] = [
    { label: tr ? "Ürün" : "Product", value: orderChoiceLabel("productType", order.productType, locale) },
    { label: tr ? "Ağaç" : "Wood", value: orderChoiceLabel("woodType", order.woodType, locale) },
  ];
  if (seating) {
    if (order.upholstery) rows.push({ label: tr ? "Döşeme" : "Upholstery", value: orderChoiceLabel("upholstery", order.upholstery, locale) });
    if (order.quantity) rows.push({ label: tr ? "Model / adet" : "Model / quantity", value: order.quantity });
  } else {
    rows.push(
      { label: tr ? "Epoksi" : "Resin", value: orderChoiceLabel("epoxy", order.epoxy, locale) },
      { label: tr ? "Ayak modeli" : "Base style", value: orderChoiceLabel("legStyle", order.legStyle, locale) },
    );
  }
  rows.push(
    { label: tr ? "Ölçüler" : "Dimensions", value: order.dimensions },
    { label: tr ? "Yüzey" : "Finish", value: orderChoiceLabel("finish", order.finish, locale) },
  );
  if (order.notes?.trim()) rows.push({ label: tr ? "Özel notlar" : "Special notes", value: order.notes.trim() });
  return rows;
}
