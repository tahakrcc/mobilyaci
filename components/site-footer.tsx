import Link from "next/link";
import type { Locale } from "@/lib/catalog";

export function SiteFooter({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  return <footer className="site-footer site-footer-expanded">
    <div className="brand"><span className="brand-mark">WU</span><span className="brand-word">WOODEN<span>UNIVERSE</span></span></div>
    <p>{tr ? "Adana'da el işçiliğiyle üretilen özel ahşap ve epoksi tasarımlar." : "Bespoke wood and resin pieces handcrafted in Adana."}</p>
    <div className="footer-links"><Link href={`/${locale}/woods`}>{tr ? "Ağaçlar" : "Woods"}</Link><Link href={`/${locale}/products`}>{tr ? "Koleksiyon" : "Collection"}</Link><Link href={`/${locale}/projects`}>{tr ? "Projeler" : "Projects"}</Link><Link href={`/${locale}/workshop`}>{tr ? "Atölye" : "Workshop"}</Link></div>
    <div className="footer-links"><Link href={`/${locale}/about`}>{tr ? "Hakkımızda" : "About"}</Link><Link href={`/${locale}/contact`}>{tr ? "İletişim" : "Contact"}</Link><Link href={`/${locale}/faq`}>{tr ? "Sık Sorulanlar" : "FAQ"}</Link><Link href={`/${locale}/track`}>{tr ? "Sipariş Takibi" : "Track Order"}</Link></div>
    <div className="footer-legal"><Link href={`/${locale}/kvkk`}>KVKK</Link><Link href={`/${locale}/privacy`}>{tr ? "Gizlilik" : "Privacy"}</Link><Link href={`/${locale}/terms`}>{tr ? "Kullanım Koşulları" : "Terms"}</Link><a href="https://www.instagram.com/woodenuniverse.official/" target="_blank" rel="noreferrer">Instagram</a></div>
    <small>© {new Date().getFullYear()} WoodenUniverse</small>
  </footer>;
}
