export type Locale = "tr" | "en";

export type Product = {
  id: string;
  nameTr: string;
  nameEn: string;
  categoryTr: string;
  categoryEn: string;
  category?: string;
  wood: string;
  epoxyTr: string;
  epoxyEn: string;
  dimensions: string;
  image: string;
  gallery?: string[];
  active?: boolean;
};

export const isLocale = (value: string): value is Locale => value === "tr" || value === "en";

export const copy = {
  tr: {
    nav: { woods: "Ağaçlar", products: "Mobilya", chairs: "Sandalyeler", sets: "Setler", projects: "Projeler", process: "Üretim", track: "Sipariş Takibi", design: "Tasarımını Oluştur" },
    heroEyebrow: "WOOD · EPOXY · CRAFT",
    heroTitle: "Ağacın özü. Size ait bir form.",
    heroSubtitle: "Yaşını damarlarında taşıyan seçilmiş ahşaplar, çağdaş formlara dönüşüyor. Her parça yalnızca bir kez üretiliyor.",
    heroPrimary: "Ağacın içine yolculuk",
    heroSecondary: "Koleksiyonu keşfet",
    storyEyebrow: "AĞACIN İÇİNDEKİ ZAMAN",
    storyTitle: "Malzemeyi saklamıyoruz. Hikâyeyi açığa çıkarıyoruz.",
    storyBody: "Kaydırın; gövdeyi, yıllık halkaları, damarları ve seçilen parçanın nasıl bir tasarıma dönüştüğünü keşfedin.",
    productsEyebrow: "SEÇİLMİŞ PARÇALAR",
    productsTitle: "Kopyası olmayan parçalar.",
    processTitle: "Talebinizden teslimata görünür bir süreç.",
    ctaTitle: "Bir mobilya değil, size ait bir parça tasarlayın.",
    footer: "Adana'da el işçiliğiyle üretilen özel ahşap ve epoksi tasarımlar.",
  },
  en: {
    nav: { woods: "Woods", products: "Furniture", chairs: "Chairs", sets: "Sets", projects: "Projects", process: "Process", track: "Track Order", design: "Create Yours" },
    heroEyebrow: "WOOD · EPOXY · CRAFT",
    heroTitle: "The soul of wood. A form of your own.",
    heroSubtitle: "Selected timber carrying time in its grain, shaped into contemporary forms. Every piece is made only once.",
    heroPrimary: "Enter the tree",
    heroSecondary: "Explore collection",
    storyEyebrow: "TIME INSIDE THE TREE",
    storyTitle: "We do not hide the material. We reveal its story.",
    storyBody: "Scroll through the trunk, growth rings and grain to see how a selected slab becomes a finished object.",
    productsEyebrow: "SELECTED PIECES",
    productsTitle: "Pieces without copies.",
    processTitle: "A visible process from request to delivery.",
    ctaTitle: "Design a piece that belongs only to you.",
    footer: "Bespoke wood and epoxy pieces handcrafted in Adana.",
  },
} as const;

export const trees = [
  { id: "olive", tr: "Zeytin", en: "Olive", years: "80–250+", tone: "#b28b52", traitTr: "Yoğun, hareketli ve heykelsi damar", traitEn: "Dense, flowing, sculptural grain" },
  { id: "beech", tr: "Kayın", en: "Beech", years: "40–120+", tone: "#c99b6b", traitTr: "Sakin doku, güçlü ve işlenebilir yapı", traitEn: "Calm texture, strong and workable structure" },
  { id: "pine", tr: "Çam", en: "Pine", years: "30–100+", tone: "#cfa76b", traitTr: "Açık ton, belirgin ve sıcak halkalar", traitEn: "Light tone with distinct warm rings" },
  { id: "walnut", tr: "Ceviz", en: "Walnut", years: "40–120+", tone: "#65402c", traitTr: "Derin kahve, sakin ve dengeli", traitEn: "Deep brown, calm and balanced" },
  { id: "chestnut", tr: "Kestane", en: "Chestnut", years: "50–150+", tone: "#a66f3d", traitTr: "Belirgin çizgiler, sıcak altın ton", traitEn: "Pronounced lines, warm golden tone" },
  { id: "oak", tr: "Meşe", en: "Oak", years: "60–200+", tone: "#c09b68", traitTr: "Güçlü, düzenli ve zamansız", traitEn: "Strong, ordered and timeless" },
  { id: "ash", tr: "Dişbudak", en: "Ash", years: "40–120+", tone: "#d2b58d", traitTr: "Açık renk, uzun ve canlı damar", traitEn: "Pale color with long expressive grain" },
  { id: "iroko", tr: "Iroko", en: "Iroko", years: "60–180+", tone: "#9b6537", traitTr: "Altın kahve, dış mekâna dayanıklı karakter", traitEn: "Golden brown with outdoor durability" },
  { id: "sapele", tr: "Sapelli", en: "Sapele", years: "50–150+", tone: "#8b422f", traitTr: "Kızıl kahve, ipeksi ve yönlü damar", traitEn: "Reddish brown with a silky directional grain" },
  { id: "sipo", tr: "Sipo", en: "Sipo", years: "50–150+", tone: "#7a4934", traitTr: "Dengeli kızıl ton, rafine ve homojen doku", traitEn: "Balanced red tone with a refined even texture" },
];

export const products: Product[] = [
  { id: "olive-noir", nameTr: "Zeytin Noir Yemek Masası", nameEn: "Olive Noir Dining Table", categoryTr: "Yemek Masası", categoryEn: "Dining Table", category: "tables", wood: "olive", epoxyTr: "Füme siyah", epoxyEn: "Smoky black", dimensions: "Özel ölçü", image: "/images/real/black-epoxy-dining.jpeg" },
  { id: "turquoise-river", nameTr: "Zeytin Turkuaz Masa", nameEn: "Olive Turquoise Table", categoryTr: "Yemek Masası", categoryEn: "Dining Table", category: "tables", wood: "olive", epoxyTr: "Şeffaf turkuaz", epoxyEn: "Transparent turquoise", dimensions: "Özel ölçü", image: "/images/real/turquoise-epoxy-table.jpeg" },
  { id: "walnut-executive", nameTr: "Ceviz Executive Çalışma Masası", nameEn: "Walnut Executive Desk", categoryTr: "Çalışma Masası", categoryEn: "Executive Desk", wood: "walnut", epoxyTr: "Füme çatlak dolgu", epoxyEn: "Smoky fissure fill", dimensions: "200 × 90 × 76 cm", image: "/images/walnut-desk.webp" },
  { id: "olive-console", nameTr: "Masif Line Konsol", nameEn: "Solid Line Console", categoryTr: "Konsol", categoryEn: "Console", category: "consoles", wood: "pine", epoxyTr: "Epoksisiz", epoxyEn: "No resin", dimensions: "Özel ölçü", image: "/images/real/solid-console.jpeg" },
  { id: "natural-live-edge", nameTr: "Doğal Kenar Toplantı Masası", nameEn: "Natural Live Edge Meeting Table", categoryTr: "Toplantı Masası", categoryEn: "Meeting Table", category: "tables", wood: "olive", epoxyTr: "Şeffaf detay", epoxyEn: "Clear detail", dimensions: "Özel ölçü", image: "/images/real/natural-live-edge-table.jpeg" },
];

export const orderStatuses = [
  { id: "received", tr: "Talebiniz alındı", en: "Request received" },
  { id: "reviewing", tr: "İnceleniyor", en: "Under review" },
  { id: "quoted", tr: "Teklif hazırlandı", en: "Quote prepared" },
  { id: "approval", tr: "Müşteri onayı bekleniyor", en: "Awaiting approval" },
  { id: "material", tr: "Malzeme seçildi", en: "Material selected" },
  { id: "production", tr: "Üretimde", en: "In production" },
  { id: "epoxy", tr: "Epoksi uygulanıyor", en: "Resin application" },
  { id: "finishing", tr: "Yüzey işlemleri", en: "Finishing" },
  { id: "quality", tr: "Kalite kontrol", en: "Quality control" },
  { id: "ready", tr: "Teslimata hazır", en: "Ready for delivery" },
  { id: "delivered", tr: "Teslim edildi", en: "Delivered" },
] as const;
