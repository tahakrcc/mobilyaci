"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/catalog";
import { copy } from "@/lib/catalog";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = copy[locale];
  const other = locale === "tr" ? "en" : "tr";
  const links = [
    [t.nav.woods, `/${locale}/woods`],
    [t.nav.products, `/${locale}/products`],
    [t.nav.projects, `/${locale}/projects`],
    [t.nav.process, `/${locale}/workshop`],
    [t.nav.track, `/${locale}/track`],
    [locale === "tr" ? "İletişim" : "Contact", `/${locale}/contact`],
  ];
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="WoodenUniverse">
        <span className="brand-mark">WU</span>
        <span className="brand-word">WOODEN<span>UNIVERSE</span></span>
      </Link>
      <nav className={open ? "nav-links open" : "nav-links"} aria-label="Ana navigasyon">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="lang-link" href={`/${other}`}>{other.toUpperCase()}</Link>
        <Link className="nav-cta" href={`/${locale}/design`}>{t.nav.design}</Link>
      </nav>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Menüyü aç" aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
