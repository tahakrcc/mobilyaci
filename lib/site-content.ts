import type { Locale } from "@/lib/catalog";

export type LocalText = { tr: string; en: string };
export const local = (value: LocalText, locale: Locale) => value[locale];

export const treeProfiles = {
  olive: {
    image: "/images/hero-olive-epoxy.webp",
    title: { tr: "Zeytin ağacı", en: "Olive wood" },
    lead: { tr: "Yılların kıvrılarak ilerlediği, her kesitte başka bir hareket taşıyan heykelsi bir ağaç.", en: "A sculptural wood where years flow in curves and every cut carries a different movement." },
    origin: { tr: "Akdeniz havzası", en: "Mediterranean basin" },
    character: { tr: "Hareketli, kontrastlı, güçlü", en: "Flowing, contrasted, bold" },
    use: { tr: "Yemek masası, konsol, odak parçaları", en: "Dining tables, consoles, statement pieces" },
    finish: { tr: "Doğal yağ veya mat vernik", en: "Natural oil or matte lacquer" },
  },
  walnut: {
    image: "/images/walnut-desk.webp",
    title: { tr: "Ceviz ağacı", en: "Walnut wood" },
    lead: { tr: "Derin kahve tonları ve dengeli damarıyla çalışma alanlarına sakin bir ağırlık kazandırır.", en: "Deep brown tones and balanced grain bring a calm weight to working spaces." },
    origin: { tr: "Anadolu ve Avrupa", en: "Anatolia and Europe" },
    character: { tr: "Sakin, derin, rafine", en: "Calm, deep, refined" },
    use: { tr: "Çalışma masası, toplantı masası, raf", en: "Desks, meeting tables, shelving" },
    finish: { tr: "Mat yağ, füme detaylar", en: "Matte oil, smoked details" },
  },
  chestnut: {
    image: "/images/turquoise-coffee-table.webp",
    title: { tr: "Kestane ağacı", en: "Chestnut wood" },
    lead: { tr: "Belirgin damar çizgileri ve sıcak altın tonuyla epoksi renklerini güçlü biçimde taşır.", en: "Pronounced grain and warm gold tones carry resin colors with confidence." },
    origin: { tr: "Karadeniz ve Marmara", en: "Black Sea and Marmara" },
    character: { tr: "Sıcak, çizgisel, canlı", en: "Warm, linear, lively" },
    use: { tr: "Orta sehpa, yan sehpa, dresuar", en: "Coffee tables, side tables, consoles" },
    finish: { tr: "Şeffaf yağ, renkli epoksi", en: "Clear oil, colored resin" },
  },
  oak: {
    image: "/images/olive-console.webp",
    title: { tr: "Meşe ağacı", en: "Oak wood" },
    lead: { tr: "Düzenli dokusu, yüksek dayanımı ve zamansız tonu sayesinde büyük formlarda güven verir.", en: "Its ordered texture, durability and timeless tone give confidence to larger forms." },
    origin: { tr: "Anadolu ve Avrupa", en: "Anatolia and Europe" },
    character: { tr: "Güçlü, düzenli, zamansız", en: "Strong, ordered, timeless" },
    use: { tr: "Yemek masası, bank, geniş yüzeyler", en: "Dining tables, benches, broad surfaces" },
    finish: { tr: "Doğal veya koyu tonlu yağ", en: "Natural or dark-toned oil" },
  },
} as const;

export const projects = [
  { id: "olive-noir-residence", image: "/images/hero-olive-epoxy.webp", title: { tr: "Zeytin Noir Konut", en: "Olive Noir Residence" }, type: { tr: "Yemek alanı", en: "Dining space" }, place: "Adana", year: "2026", story: { tr: "Mekânın koyu taş yüzeyleri için seçilen hareketli zeytin plaka, füme epoksiyle dengelenerek tek parça bir yemek masasına dönüştürüldü.", en: "A flowing olive slab selected for the room's dark stone surfaces was balanced with smoky resin and shaped into a one-of-one dining table." } },
  { id: "turquoise-living", image: "/images/turquoise-coffee-table.webp", title: { tr: "Turkuaz Yaşam Alanı", en: "Turquoise Living Space" }, type: { tr: "Salon", en: "Living room" }, place: "Mersin", year: "2026", story: { tr: "Kestanenin sıcak çizgileri, mekândaki Akdeniz ışığını taşıyan şeffaf turkuaz epoksiyle buluştu.", en: "Warm chestnut lines meet transparent turquoise resin that carries the room's Mediterranean light." } },
  { id: "walnut-office", image: "/images/walnut-desk.webp", title: { tr: "Ceviz Çalışma Odası", en: "Walnut Study" }, type: { tr: "Çalışma alanı", en: "Workspace" }, place: "İstanbul", year: "2026", story: { tr: "Sade metal ayak ve füme çatlak dolgusu, cevizin doğal ağırlığını bozmadan çağdaş bir çalışma yüzeyi oluşturdu.", en: "A restrained metal base and smoked fissure fill create a contemporary work surface without diminishing walnut's natural weight." } },
  { id: "olive-entry", image: "/images/olive-console.webp", title: { tr: "Zeytin Giriş Konsolu", en: "Olive Entry Console" }, type: { tr: "Giriş alanı", en: "Entrance" }, place: "Ankara", year: "2026", story: { tr: "Dar bir geçiş alanı için ağacın canlı kenarı korunarak hafif, duvara yakın bir konsol üretildi.", en: "For a narrow passage, the live edge was preserved in a light console designed to sit close to the wall." } },
] as const;

export const faqs = [
  { q: { tr: "Üretim ne kadar sürüyor?", en: "How long does production take?" }, a: { tr: "Tasarım, plaka ve ölçü onayından sonra ürün tipine göre yaklaşık 6–12 hafta sürer. Kesin takvim teklif aşamasında paylaşılır.", en: "After design, slab and dimension approval, production typically takes 6–12 weeks depending on the piece. The exact schedule is shared with the quote." } },
  { q: { tr: "Sitede ödeme yapılıyor mu?", en: "Do I pay on the website?" }, a: { tr: "Hayır. Site yalnızca talep oluşturur. Atölye sizinle iletişime geçer; malzeme, kapsam, teklif ve ödeme koşulları ayrıca netleştirilir.", en: "No. The website only creates a request. The workshop contacts you to confirm material, scope, quote and payment terms separately." } },
  { q: { tr: "Gerçek ahşap plakayı seçebilir miyim?", en: "Can I choose the actual slab?" }, a: { tr: "Evet. Uygun plakalar fotoğraf ve videolarıyla sunulur. Üretime seçtiğiniz plaka onaylandıktan sonra başlanır.", en: "Yes. Suitable slabs are presented by photo and video. Production starts after you approve the selected slab." } },
  { q: { tr: "Ölçüler kişiye özel değişebilir mi?", en: "Can dimensions be customized?" }, a: { tr: "Evet. Alanınızın ölçüsü, kullanım biçimi ve taşıma koşulları birlikte değerlendirilir.", en: "Yes. Your space, intended use and delivery constraints are evaluated together." } },
  { q: { tr: "Epoksi rengi seçilebilir mi?", en: "Can I choose the resin color?" }, a: { tr: "Şeffaf, füme ve seçili renk seçenekleri uygulanabilir. Sonuç, ağacın tonu ve damar yapısına göre birlikte kararlaştırılır.", en: "Clear, smoky and selected colors are available. The final choice is made with the wood tone and grain in mind." } },
  { q: { tr: "Siparişimi nasıl takip ederim?", en: "How do I track my order?" }, a: { tr: "Talebiniz oluşturulduğunda verilen sipariş numarası ve güvenli takip bağlantısıyla üretim aşamalarını görebilirsiniz.", en: "Use the order number and secure tracking link provided after your request to follow each production stage." } },
] as const;
