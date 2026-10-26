"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { copy } from "@/lib/catalog";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const t = copy[locale];
  const other = locale === "tr" ? "en" : "tr";
  const links = [
    [t.nav.chairs, `/${locale}/chairs`],
    [t.nav.sets, `/${locale}/sets`],
    [t.nav.woods, `/${locale}/woods`],
    [t.nav.projects, `/${locale}/projects`],
    [t.nav.track, `/${locale}/track`],
  ];
  const furnitureLinks = [
    [locale === "tr" ? "Masalar" : "Tables", `/${locale}/products/category/tables`],
    [locale === "tr" ? "Sehpalar" : "Coffee Tables", `/${locale}/products/category/coffee-tables`],
    [locale === "tr" ? "Çalışma Masaları" : "Desks", `/${locale}/products/category/desks`],
    [locale === "tr" ? "TV Üniteleri" : "TV Units", `/${locale}/products/category/tv-units`],
    [locale === "tr" ? "Konsollar" : "Consoles", `/${locale}/products/category/consoles`],
    [locale === "tr" ? "Bar Üniteleri" : "Bar Units", `/${locale}/products/category/bars`],
    [locale === "tr" ? "Kitaplıklar" : "Bookcases", `/${locale}/products/category/bookcases`],
    [locale === "tr" ? "Kahve Köşeleri" : "Coffee Corners", `/${locale}/products/category/coffee-corners`],
    [t.nav.chairs, `/${locale}/chairs`],
    [t.nav.sets, `/${locale}/sets`],
  ];
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <a className="brand" href={`/${locale}`} aria-label="WoodenUniverse">
        <span className="brand-mark brand-mark-image"><Image src="/brand/wooden-universe-mark.png" alt="" width={48} height={48} /></span>
        <span className="brand-word">WOODEN<span>UNIVERSE</span></span>
      </a>
      <nav className={open ? "nav-links open" : "nav-links"} aria-label={locale === "tr" ? "Ana navigasyon" : "Main navigation"}>
        <div className="nav-catalog-group">
          <a href={`/${locale}/products`} onClick={() => setOpen(false)}>{t.nav.products}</a>
          <div className="nav-catalog-submenu" aria-label={locale === "tr" ? "Mobilya kategorileri" : "Furniture categories"}>
            {furnitureLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          </div>
        </div>
        {links.map(([label, href], index) => <a className={index < 2 ? "nav-desktop-category" : undefined} key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="lang-link" href={`/${other}`}>{other.toUpperCase()}</a>
        <a className="nav-cta" href={`/${locale}/design`}>{t.nav.design}</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Menüyü aç" aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
