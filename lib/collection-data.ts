import type { Locale } from "@/lib/catalog";

export type Localized = { tr: string; en: string };

export type FurnitureCategory = {
  id: string;
  title: Localized;
  eyebrow: Localized;
  description: Localized;
  image: string;
  priority?: boolean;
};

export type ChairModel = {
  id: string;
  name: string;
  type: Localized;
  description: Localized;
  colors: string[];
  image: string;
  gallery?: string[];
  imagePosition?: string;
  mobileImagePosition?: string;
  index: number;
  active?: boolean;
};

export type SetModel = {
  id: string;
  name: string;
  kind: Localized;
  sizes: string;
  image: string;
  gallery?: string[];
  imagePosition?: string;
  mobileImagePosition?: string;
  capacity: Localized;
  active?: boolean;
};

export const furnitureCategories: FurnitureCategory[] = [
  { id: "tv-units", title: { tr: "TV Üniteleri", en: "TV Units" }, eyebrow: { tr: "ÖNCELİKLİ KOLEKSİYON", en: "PRIORITY COLLECTION" }, description: { tr: "Masif ahşap, açık raf ve kapalı depolamayı mekâna göre birleştiren özel üretimler.", en: "Bespoke compositions combining solid wood, open shelving and closed storage." }, image: "/images/real/priority-tv-unit.jpeg", priority: true },
  { id: "consoles", title: { tr: "Konsollar", en: "Consoles" }, eyebrow: { tr: "ÖNCELİKLİ KOLEKSİYON", en: "PRIORITY COLLECTION" }, description: { tr: "Doğal damar, işlevsel depolama ve metal detaylarla kurulan bağımsız parçalar.", en: "Statement pieces shaped through natural grain, storage and metal detail." }, image: "/images/real/priority-console.jpeg", priority: true },
  { id: "coffee-corners", title: { tr: "Kahve Köşeleri", en: "Coffee Corners" }, eyebrow: { tr: "ÖZEL ÜRETİM", en: "BESPOKE PRODUCTION" }, description: { tr: "Servis, sergileme ve depolamayı tek kompozisyonda çözen mekâna özel üniteler.", en: "Tailored units bringing service, display and storage into one composition." }, image: "/images/real/solid-console.jpeg" },
  { id: "tables", title: { tr: "Masalar", en: "Tables" }, eyebrow: { tr: "TEK PARÇA ÜRETİM", en: "ONE OF ONE" }, description: { tr: "Epoksili veya düz kütük; yemek, toplantı ve çalışma alanları için özel ölçü masalar.", en: "Custom-size resin or solid-slab tables for dining, meetings and work." }, image: "/images/real/black-epoxy-dining.jpeg" },
  { id: "coffee-tables", title: { tr: "Sehpalar", en: "Coffee Tables" }, eyebrow: { tr: "YAŞAM ALANI", en: "LIVING SPACE" }, description: { tr: "Doğal kenarı koruyan, renkli veya füme epoksiyle tamamlanan orta ve yan sehpalar.", en: "Coffee and side tables preserving the live edge with colored or smoked resin." }, image: "/images/real/turquoise-epoxy-table.jpeg" },
  { id: "desks", title: { tr: "Çalışma Masaları", en: "Desks" }, eyebrow: { tr: "ÇALIŞMA ALANI", en: "WORKSPACE" }, description: { tr: "Kablo, çekmece ve ölçü detayları kullanım biçimine göre tasarlanan masalar.", en: "Desks tailored around cable, drawer and dimension requirements." }, image: "/images/walnut-desk.webp" },
  { id: "bars", title: { tr: "Bar Üniteleri", en: "Bar Units" }, eyebrow: { tr: "ÖNCELİKLİ KOLEKSİYON", en: "PRIORITY COLLECTION" }, description: { tr: "Ev, restoran ve oteller için tezgâh, depolama ve servis çözümleri.", en: "Counter, storage and service solutions for homes, restaurants and hotels." }, image: "/images/real/priority-bar.jpeg", priority: true },
  { id: "bookcases", title: { tr: "Kitaplıklar", en: "Bookcases" }, eyebrow: { tr: "ÖNCELİKLİ KOLEKSİYON", en: "PRIORITY COLLECTION" }, description: { tr: "Masif ahşap ile metal konstrüksiyonu birleştiren modüler veya sabit kitaplıklar.", en: "Modular or fixed bookcases combining solid wood and metal construction." }, image: "/images/real/priority-bookcase.jpeg", priority: true },
];

const chairNames = [
  ["luna", "Luna", 2], ["paris", "Paris", 2], ["nest", "Nest", 4], ["sisy", "Sisy", 4],
  ["riva", "Riva", 6], ["nova", "Nova", 6], ["arc", "Arc", 8], ["rolla", "Rolla", 8],
  ["temodel", "Temodel", 10], ["pear", "Pear", 10], ["oval", "Oval", 12], ["snack", "Snack", 12],
  ["henna", "Henna", 14], ["linen", "Linen", 14], ["aura", "Aura", 16], ["liva", "Liva", 16],
  ["pixel", "Pixel", 18], ["cros", "Cros", 18], ["axis", "Axis", 19], ["regal", "Regal", 19],
  ["palma", "Palma", 20], ["noir", "Noir", 20], ["madam", "Madam", 21], ["matmazel", "Matmazel", 21],
  ["matmazel-golden-green", "Matmazel Golden Green", 22], ["francis", "Francis", 22],
  ["fransuva", "Fransuva", 23], ["versailles", "Versailles", 23],
  ["milo-bar", "Milo Bar", 24], ["noir-baroque", "Noir Baroque", 24],
  ["verde-bar", "Verde Bar", 25], ["louis-bar", "Louis Bar", 25], ["madam-bar", "Madam Bar", 26],
] as const;

export const chairModels: ChairModel[] = chairNames.map(([id, name, page], index) => ({
  id,
  name,
  type: id.includes("bar") ? ({ tr: "Bar sandalyesi", en: "Bar chair" } satisfies Localized) : ({ tr: "Sandalye", en: "Chair" } satisfies Localized),
  description: {
    tr: "Ahşap rengi ve döşemesi projeye göre seçilebilen Wooden Universe koleksiyon modeli.",
    en: "A Wooden Universe collection model with wood color and upholstery tailored to the project.",
  },
  colors: ["Ceviz / Walnut", "Naturel / Natural", "Siyah / Black", "Beyaz / White"],
  image: `/images/catalog/chairs/page-${String(page).padStart(2, "0")}.webp`,
  index: index + 1,
}));

const compactSets = ["Rolla", "Paris", "Arc", "Luna", "Aura", "Pear", "Snack", "Sisy", "Nest", "Henna", "Riva", "Temodel", "Pixel"];
const largeSets = ["Luna", "Riva", "Nest", "Fransuva"];

export const setModels: SetModel[] = [
  ...compactSets.map((name, index) => ({
    id: `${name.toLowerCase()}-cafe-set`, name: `${name} Set`, kind: { tr: "Kafe ve restoran seti", en: "Cafe and restaurant set" },
    sizes: index < 9 ? "Ø60 / Ø70 / Ø80 cm" : "60×60 / 70×70 / 80×80 cm",
    image: `/images/catalog/sets/page-${String(index === 0 ? 27 : 28 + Math.floor((index - 1) / 2)).padStart(2, "0")}.webp`,
    imagePosition: index === 0 ? "center" : index % 2 === 1 ? "center 20%" : "center 80%",
    mobileImagePosition: index === 0 ? "center" : index % 2 === 1 ? "center 20%" : "center 80%",
    capacity: { tr: "2–4 kişilik", en: "Seats 2–4" },
  })),
  ...largeSets.map((name, index) => ({
    id: `${name.toLowerCase()}-six-seat-set`, name: `${name} Set`, kind: { tr: "Büyük yemek seti", en: "Large dining set" },
    sizes: index === 3 ? "Ø140 cm" : "Ø130 cm",
    image: `/images/catalog/sets/page-${String(35 + index).padStart(2, "0")}.webp`,
    capacity: { tr: "6 kişilik", en: "Seats 6" },
  })),
];

export const localized = (value: Localized, locale: Locale) => value[locale];
