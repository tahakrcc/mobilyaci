export type Locale = "tr" | "en";

export const isLocale = (value: string): value is Locale => value === "tr" || value === "en";

export const copy = {
  tr: {
    nav: { woods: "Ağaçlar", products: "Koleksiyon", projects: "Projeler", process: "Üretim", track: "Sipariş Takibi", design: "Tasarımını Oluştur" },
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
    nav: { woods: "Woods", products: "Collection", projects: "Projects", process: "Process", track: "Track Order", design: "Create Yours" },
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
  { id: "walnut", tr: "Ceviz", en: "Walnut", years: "40–120+", tone: "#65402c", traitTr: "Derin kahve, sakin ve dengeli", traitEn: "Deep brown, calm and balanced" },
  { id: "chestnut", tr: "Kestane", en: "Chestnut", years: "50–150+", tone: "#a66f3d", traitTr: "Belirgin çizgiler, sıcak altın ton", traitEn: "Pronounced lines, warm golden tone" },
  { id: "oak", tr: "Meşe", en: "Oak", years: "60–200+", tone: "#c09b68", traitTr: "Güçlü, düzenli ve zamansız", traitEn: "Strong, ordered and timeless" },
];

export const products = [
  { id: "olive-noir", nameTr: "Zeytin Noir Yemek Masası", nameEn: "Olive Noir Dining Table", categoryTr: "Yemek Masası", categoryEn: "Dining Table", wood: "olive", epoxyTr: "Füme siyah", epoxyEn: "Smoky black", dimensions: "220 × 100 × 76 cm", image: "/images/hero-olive-epoxy.webp" },
  { id: "turquoise-river", nameTr: "Kestane Turkuaz Orta Sehpa", nameEn: "Chestnut Turquoise Coffee Table", categoryTr: "Orta Sehpa", categoryEn: "Coffee Table", wood: "chestnut", epoxyTr: "Şeffaf turkuaz", epoxyEn: "Transparent turquoise", dimensions: "130 × 75 × 42 cm", image: "/images/turquoise-coffee-table.webp" },
  { id: "walnut-executive", nameTr: "Ceviz Executive Çalışma Masası", nameEn: "Walnut Executive Desk", categoryTr: "Çalışma Masası", categoryEn: "Executive Desk", wood: "walnut", epoxyTr: "Füme çatlak dolgu", epoxyEn: "Smoky fissure fill", dimensions: "200 × 90 × 76 cm", image: "/images/walnut-desk.webp" },
  { id: "olive-console", nameTr: "Zeytin Line Konsol", nameEn: "Olive Line Console", categoryTr: "Konsol", categoryEn: "Console", wood: "olive", epoxyTr: "Şeffaf", epoxyEn: "Clear", dimensions: "180 × 38 × 82 cm", image: "/images/olive-console.webp" },
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
