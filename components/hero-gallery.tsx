"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/catalog";
import { products } from "@/lib/catalog";

export function HeroGallery({ locale, initialImage }: { locale: Locale; initialImage: string }) {
  const slides = products.map((product, index) => ({
    ...product,
    image: index === 0 ? initialImage : product.image,
  }));
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const travel = useRef(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => {
        if (current >= slides.length - 1) travel.current = -1;
        if (current <= 0) travel.current = 1;
        setDirection(travel.current === 1 ? "forward" : "back");
        return current + travel.current;
      });
    }, 4600);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const move = (next: number) => {
    const normalized = (next + slides.length) % slides.length;
    setDirection(normalized > active || (active === slides.length - 1 && normalized === 0) ? "forward" : "back");
    travel.current = normalized === slides.length - 1 ? -1 : normalized === 0 ? 1 : travel.current;
    setActive(normalized);
  };

  const product = slides[active];
  return (
    <div className="hero-gallery" aria-roledescription="carousel" aria-label={locale === "tr" ? "Öne çıkan tasarımlar" : "Featured designs"}>
      <div className={`hero-slides is-${direction}`}>
        {slides.map((slide, index) => (
          <div className={index === active ? "hero-slide active" : "hero-slide"} key={slide.id} aria-hidden={index !== active}>
            <img src={slide.image} alt={locale === "tr" ? slide.nameTr : slide.nameEn} />
          </div>
        ))}
      </div>
      <div className="hero-object-label" aria-live="polite">
        <span>NO. {String(active + 1).padStart(2, "0")}</span>
        <strong>{locale === "tr" ? product.nameTr : product.nameEn}</strong>
        <small>{product.dimensions}</small>
      </div>
      <div className="hero-gallery-controls">
        <button type="button" onClick={() => move(active - 1)} aria-label={locale === "tr" ? "Önceki görsel" : "Previous image"}><ArrowLeft /></button>
        <div className="hero-gallery-dots">
          {slides.map((slide, index) => <button type="button" key={slide.id} className={index === active ? "active" : ""} onClick={() => move(index)} aria-label={`${index + 1}. ${locale === "tr" ? "görsel" : "image"}`} />)}
        </div>
        <button type="button" onClick={() => move(active + 1)} aria-label={locale === "tr" ? "Sonraki görsel" : "Next image"}><ArrowRight /></button>
      </div>
      <span className="hero-gallery-count">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
    </div>
  );
}
