import { notFound } from "next/navigation";
import { InnerHero, InnerShell } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";

type Kind = "kvkk" | "privacy" | "terms";
const legal = {
  kvkk: {
    tr: ["KVKK Aydınlatma Metni", "Kişisel verilerinizi yalnızca talebinizi değerlendirmek, sizinle iletişim kurmak, üretim sürecini yürütmek ve sipariş takibini sağlamak amacıyla işleriz.", ["İşlenen veriler", "Ad, iletişim bilgileri, şehir, talep ettiğiniz ürün bilgileri, ölçüler ve isteğe bağlı olarak paylaştığınız dosya veya notlar."], ["Saklama ve güvenlik", "Veriler, iş ilişkisinin gerektirdiği süre boyunca ve yasal yükümlülüklerle sınırlı olarak korunur. Yetkisiz erişimi önlemek için erişim kontrolleri uygulanır."], ["Haklarınız", "6698 sayılı Kanun kapsamındaki erişim, düzeltme, silme ve itiraz haklarınızı iletişim kanallarımız üzerinden kullanabilirsiniz."]],
    en: ["Personal Data Notice", "We process personal data only to review your request, contact you, manage production and provide order tracking.", ["Data processed", "Name, contact details, city, requested product information, dimensions and any optional files or notes you submit."], ["Retention and security", "Data is retained only as required by the relationship and legal obligations, with access controls against unauthorized use."], ["Your rights", "You may request access, correction, deletion or objection through our contact channels, subject to applicable law."]],
  },
  privacy: {
    tr: ["Gizlilik Politikası", "Bu site, ziyaret deneyimini ve talep süreçlerini yürütmek için yalnızca gerekli verileri kullanır. Site üzerinden ödeme veya kart bilgisi alınmaz.", ["Sipariş talepleri", "Formda paylaştığınız bilgiler teklif ve üretim değerlendirmesi için kullanılır."], ["Teknik veriler", "Güvenlik ve performans amacıyla sınırlı teknik kayıtlar işlenebilir."], ["Üçüncü taraflar", "Zorunlu hizmet sağlayıcılar dışında bilgiler pazarlama amacıyla satılmaz veya paylaşılmaz."]],
    en: ["Privacy Policy", "This site uses only the data required to operate the visitor and request experience. No payment or card information is collected.", ["Design requests", "Information submitted through the form is used to assess quoting and production."], ["Technical data", "Limited technical logs may be processed for security and performance."], ["Third parties", "Information is not sold or shared for marketing beyond required service providers."]],
  },
  terms: {
    tr: ["Kullanım Koşulları", "Sitedeki görseller ve ölçüler örnek niteliğindedir. Her parça gerçek ahşap plakaya ve onaylanan üretim kapsamına göre yeniden tasarlanır.", ["Talep ve teklif", "Form göndermek sipariş veya ödeme yükümlülüğü oluşturmaz. Sipariş, yazılı kapsam ve teklif onayıyla kesinleşir."], ["Doğal farklılıklar", "Renk, damar, çatlak ve kenar farklılıkları doğal ahşabın karakteridir; kusur veya birebir tekrar garantisi olarak değerlendirilemez."], ["Görsel hakları", "Sitedeki fotoğraf, metin ve tasarımlar izin alınmadan ticari amaçla kullanılamaz."]],
    en: ["Terms of Use", "Images and dimensions are references. Every piece is redesigned around the actual slab and approved production scope.", ["Request and quote", "Submitting a form does not create an order or payment obligation. An order is confirmed only through written scope and quote approval."], ["Natural variation", "Differences in color, grain, cracks and edge are part of natural wood and cannot be treated as defects or promised exact repeats."], ["Content rights", "Photography, copy and designs on this site may not be used commercially without permission."]],
  },
} as const;

export async function LegalPage(kind: Kind, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound(); const locale = rawLocale; const data = legal[kind][locale];
  return <InnerShell locale={locale}><InnerHero locale={locale} eyebrow="WOODEN UNIVERSE" title={data[0]} lead={data[1]} index="LEGAL / 01" /><article className="legal-copy">{data.slice(2).map((section) => <section key={section[0]}><h2>{section[0]}</h2><p>{section[1]}</p></section>)}<small>{locale === "tr" ? "Son güncelleme: 14 Ekim 2026" : "Last updated: October 14, 2026"}</small></article></InnerShell>;
}
