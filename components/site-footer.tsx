import Image from "next/image";
import type { Locale } from "@/lib/catalog";

export function SiteFooter({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  return <footer className="site-footer site-footer-expanded">
    <div className="brand"><Image className="footer-brand-logo" src="/brand/wooden-universe-logo.webp" alt="WoodenUniverse" width={180} height={180} /></div>
    <p>{tr ? "Adana'da el işçiliğiyle üretilen özel ahşap ve epoksi tasarımlar." : "Bespoke wood and resin pieces handcrafted in Adana."}</p>
    <div className="footer-links"><a href={`/${locale}/products`}>{tr ? "Mobilya" : "Furniture"}</a><a href={`/${locale}/chairs`}>{tr ? "Sandalyeler" : "Chairs"}</a><a href={`/${locale}/sets`}>{tr ? "Masa ve Sandalye Setleri" : "Table & Chair Sets"}</a><a href={`/${locale}/woods`}>{tr ? "Ağaçlar" : "Woods"}</a></div>
    <div className="footer-links"><a href={`/${locale}/about`}>{tr ? "Hakkımızda" : "About"}</a><a href={`/${locale}/contact`}>{tr ? "İletişim" : "Contact"}</a><a href={`/${locale}/faq`}>{tr ? "Sık Sorulanlar" : "FAQ"}</a><a href={`/${locale}/track`}>{tr ? "Sipariş Takibi" : "Track Order"}</a></div>
    <div className="footer-legal"><a href="/catalog/Wooden_Universe_Collection_2027.pdf" download>{tr ? "Kataloğu indir" : "Download catalogue"}</a><a href={`/${locale}/kvkk`}>KVKK</a><a href={`/${locale}/privacy`}>{tr ? "Gizlilik" : "Privacy"}</a><a href={`/${locale}/terms`}>{tr ? "Kullanım Koşulları" : "Terms"}</a><a href="https://www.instagram.com/woodenuniverse.official/" target="_blank" rel="noreferrer">Instagram</a></div>
    <div className="footer-bottom"><small>© {new Date().getFullYear()} WoodenUniverse</small><small>{!tr && "Made by "}<a href="https://tahakaraca.com" target="_blank" rel="noopener noreferrer">Taha Karaca</a>{tr && " tarafından yapılmıştır"}</small></div>
  </footer>;
}
