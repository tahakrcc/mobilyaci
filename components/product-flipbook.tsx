"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { products, trees, type Locale } from "@/lib/catalog";

export function ProductFlipbook({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  const [active, setActive] = useState(0);
  const [turning, setTurning] = useState<"next" | "prev" | null>(null);
  const locked = useRef(false);

  const turn = (direction: "next" | "prev") => {
    if (locked.current) return;
    locked.current = true;
    setTurning(direction);
    window.setTimeout(() => {
      setActive((current) => (current + (direction === "next" ? 1 : -1) + products.length) % products.length);
    }, 430);
    window.setTimeout(() => { setTurning(null); locked.current = false; }, 920);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turn("next");
      if (event.key === "ArrowLeft") turn("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const product = products[active];
  const incoming = products[(active + (turning === "prev" ? -1 : 1) + products.length) % products.length];
  const tree = trees.find((item) => item.id === product.wood);

  return (
    <section className="flipbook-section" id="projects">
      <div className="flipbook-heading blur-reveal">
        <p className="eyebrow">{tr ? "SEÇİLMİŞ PARÇALAR" : "SELECTED PIECES"}</p>
        <h2>{tr ? "Her sayfa, başka bir karakter." : "A different character on every page."}</h2>
      </div>
      <div className="flipbook-layout">
        <div className="product-book" role="group" aria-label={tr ? "Ürün kitabı" : "Product book"}>
          <div className="book-shadow" />
          <div className="book-cover book-left"><span>WU</span><small>WOODEN UNIVERSE</small></div>
          <div className="book-page book-right">
            <img src={product.image} alt={tr ? product.nameTr : product.nameEn} />
            <span>{String(active + 1).padStart(2, "0")}</span>
          </div>
          {turning && <div className={`book-turning is-${turning}`}>
            <div className="page-face page-front"><img src={product.image} alt="" /></div>
            <div className="page-face page-back"><img src={incoming.image} alt="" /></div>
          </div>}
          <button className="book-hit book-hit-prev" onClick={() => turn("prev")} aria-label={tr ? "Önceki ürün" : "Previous product"} />
          <button className="book-hit book-hit-next" onClick={() => turn("next")} aria-label={tr ? "Sonraki ürün" : "Next product"} />
        </div>
        <div className={turning ? "flipbook-details is-changing" : "flipbook-details"} aria-live="polite">
          <span className="flipbook-count">{String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
          <p>{tr ? product.categoryTr : product.categoryEn}</p>
          <h3>{tr ? product.nameTr : product.nameEn}</h3>
          <dl>
            <div><dt>{tr ? "Ağaç" : "Wood"}</dt><dd>{tr ? tree?.tr : tree?.en}</dd></div>
            <div><dt>{tr ? "Epoksi" : "Resin"}</dt><dd>{tr ? product.epoxyTr : product.epoxyEn}</dd></div>
            <div><dt>{tr ? "Ölçü" : "Dimensions"}</dt><dd>{product.dimensions}</dd></div>
            <div><dt>{tr ? "Üretim" : "Edition"}</dt><dd>{tr ? "Tek parça" : "One of one"}</dd></div>
          </dl>
          <div className="flipbook-actions">
            <div><button onClick={() => turn("prev")} aria-label={tr ? "Önceki ürün" : "Previous product"}><ArrowLeft /></button><button onClick={() => turn("next")} aria-label={tr ? "Sonraki ürün" : "Next product"}><ArrowRight /></button></div>
            <Link href={`/${locale}/design?product=${product.id}`}>{tr ? "Bu parçadan yola çık" : "Begin with this piece"}<ArrowUpRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
