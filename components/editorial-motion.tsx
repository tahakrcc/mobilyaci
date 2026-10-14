"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/catalog";

export function ScrollRevealController() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".blur-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)),
      { threshold: 0.18, rootMargin: "-4% 0px -8%" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return null;
}

export function GhostTypeHeading({ title, locale }: { title: string; locale: Locale }) {
  const fallbackLead = locale === "tr" ? "Ağacın özü." : "The soul of wood.";
  const parts = title.match(/^(.+?[.!?])\s*(.*)$/);
  const lead = fallbackLead;
  const defaultEnding = locale === "tr" ? "Size ait bir form." : "A form of your own.";
  const requestedEnding = parts?.[2] || parts?.[1] || "";
  const firstEnding = requestedEnding.length <= 28 ? requestedEnding : defaultEnding;
  const endings = useMemo(
    () => locale === "tr"
      ? [firstEnding, "Tek ve size özel.", "Damarından tasarıma."]
      : [firstEnding, "Singular and yours.", "From grain to form."],
    [firstEnding, locale],
  );
  const [endingIndex, setEndingIndex] = useState(0);
  const [visible, setVisible] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = endings[endingIndex];
    const finished = visible === target;
    const empty = visible.length === 0;
    const delay = finished ? 1650 : deleting ? 32 : 58;
    const timer = window.setTimeout(() => {
      if (finished) return setDeleting(true);
      if (deleting && empty) {
        setDeleting(false);
        setEndingIndex((current) => (current + 1) % endings.length);
        return;
      }
      setVisible(deleting ? target.slice(0, Math.max(0, visible.length - 1)) : target.slice(0, visible.length + 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [deleting, endingIndex, endings, visible]);

  return (
    <h1 className="ghost-heading">
      <span>{lead}</span>
      <span className="ghost-line"><span>{visible}</span><i aria-hidden="true" /></span>
      <span className="sr-only"> {endings[0]}</span>
    </h1>
  );
}

export function TextReveal3D({ locale }: { locale: Locale }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const lines = locale === "tr"
    ? ["DOĞANIN ÇİZDİĞİ", "ELİN BİÇİMLENDİRDİĞİ", "SİZE AİT"]
    : ["DRAWN BY NATURE", "SHAPED BY HAND", "MADE FOR YOU"];

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return (
    <section className="text-reveal-3d" ref={sectionRef} aria-label={locale === "tr" ? "Tasarım manifestosu" : "Design manifesto"}>
      <div className="text-reveal-sticky">
        <p>{locale === "tr" ? "BİR MALZEMEDEN FAZLASI" : "MORE THAN A MATERIAL"}</p>
        <div className="text-cylinder" style={{ "--reveal-progress": progress } as React.CSSProperties}>
          {lines.map((line, index) => {
            const local = Math.min(1, Math.max(0, progress * 1.45 - index * .22));
            return <span key={line} style={{ "--line-progress": local } as React.CSSProperties}>{line}</span>;
          })}
        </div>
        <small>{locale === "tr" ? "KAYDIR" : "SCROLL"}</small>
      </div>
    </section>
  );
}

export function RevealHeading3D({ children, className = "", as = "h2" }: { children: string; className?: string; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const words = children.trim().split(/\s+/);
  const Heading = as;

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3, rootMargin: "-4% 0px -10%" },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <Heading ref={ref} className={`reveal-heading-3d ${visible ? "is-visible" : ""} ${className}`.trim()} aria-label={children}>
      {words.map((word, index) => (
        <span className="reveal-word" style={{ "--word-index": index } as React.CSSProperties} aria-hidden="true" key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </Heading>
  );
}

export function RibbonType({ locale }: { locale: Locale }) {
  const phrase = locale === "tr" ? "TEK PARÇA · DOĞAL DAMAR · EL İŞÇİLİĞİ · " : "ONE OF ONE · NATURAL GRAIN · MADE BY HAND · ";
  return (
    <section className="ribbon-type" aria-label={locale === "tr" ? "Marka değerleri" : "Brand values"}>
      <div className="ribbon-glow" />
      <svg viewBox="0 0 1600 330" role="img" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ribbonGold" x1="0" x2="1">
            <stop offset="0" stopColor="#8d5c1e" /><stop offset=".28" stopColor="#edc96f" /><stop offset=".55" stopColor="#aa7127" /><stop offset=".8" stopColor="#f1d27a" /><stop offset="1" stopColor="#8d5c1e" />
          </linearGradient>
          <path id="ribbonPath" d="M -120 196 C 210 42, 450 305, 780 155 S 1350 42, 1740 185" />
        </defs>
        <path className="ribbon-band" d="M -120 196 C 210 42, 450 305, 780 155 S 1350 42, 1740 185" />
        <text className="ribbon-copy"><textPath href="#ribbonPath" startOffset="-12%">{phrase.repeat(5)}<animate attributeName="startOffset" from="-12%" to="-62%" dur="17s" repeatCount="indefinite" /></textPath></text>
      </svg>
    </section>
  );
}
