"use client";

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
    [t.nav.products, `/${locale}/products`],
    [t.nav.chairs, `/${locale}/chairs`],
    [t.nav.sets, `/${locale}/sets`],
    [t.nav.woods, `/${locale}/woods`],
    [t.nav.projects, `/${locale}/projects`],
    [t.nav.track, `/${locale}/track`],
  ];
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`}>
      <a className="brand" href={`/${locale}`} aria-label="WoodenUniverse">
        <span className="brand-mark">WU</span>
        <span className="brand-word">WOODEN<span>UNIVERSE</span></span>
      </a>
      <nav className={open ? "nav-links open" : "nav-links"} aria-label="Ana navigasyon">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="lang-link" href={`/${other}`}>{other.toUpperCase()}</a>
        <a className="nav-cta" href={`/${locale}/design`}>{t.nav.design}</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Menüyü aç" aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
