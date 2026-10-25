"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/catalog";

const INTRO_KEY = "wooden-universe-intro-seen";

export function SiteIntroLoader({ locale }: { locale: Locale }) {
  const [phase, setPhase] = useState<"hidden" | "showing" | "leaving">("showing");

  useEffect(() => {
    if (window.sessionStorage.getItem(INTRO_KEY)) {
      const hideTimer = window.setTimeout(() => setPhase("hidden"), 0);
      return () => window.clearTimeout(hideTimer);
    }
    const startedAt = performance.now();
    let modelReady = document.documentElement.dataset.woodModelReady === "true";
    let leaveTimer = 0;
    let fallbackTimer = 0;

    const leave = () => {
      const remaining = Math.max(0, 2200 - (performance.now() - startedAt));
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        setPhase("leaving");
        window.sessionStorage.setItem(INTRO_KEY, "true");
        window.setTimeout(() => setPhase("hidden"), 720);
      }, remaining);
    };
    const onReady = () => {
      modelReady = true;
      leave();
    };

    window.addEventListener("wu:model-ready", onReady);
    if (modelReady) leave();
    fallbackTimer = window.setTimeout(leave, 7000);
    return () => {
      window.removeEventListener("wu:model-ready", onReady);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (phase === "hidden") return null;
  const tr = locale === "tr";
  return (
    <div className={`site-intro-loader${phase === "leaving" ? " is-leaving" : ""}`} role="status" aria-live="polite" aria-label={tr ? "Wooden Universe hazırlanıyor" : "Wooden Universe is preparing"}>
      <div className="intro-workshop" aria-hidden="true">
        <div className="intro-mark"><span>WU</span><small>WOODEN UNIVERSE</small></div>
        <div className="intro-making">
          <div className="intro-log"><i /><i /><b /></div>
          <div className="intro-saw"><i /></div>
          <div className="intro-slab"><i /><b /></div>
          <div className="intro-table"><i /><b /><b /></div>
          <div className="intro-chair"><i /><b /><b /><b /></div>
          <div className="intro-dust"><i /><i /><i /><i /><i /></div>
        </div>
        <div className="intro-copy">
          <span>{tr ? "ATÖLYEDE HAZIRLANIYOR" : "CRAFTED IN THE WORKSHOP"}</span>
          <strong>{tr ? "Ağacın karakteri, yaşam alanınıza dönüşüyor." : "The character of wood becomes part of your space."}</strong>
          <div className="intro-progress"><i /></div>
          <small>{tr ? "PLAKA · ZANAAT · FORM" : "SLAB · CRAFT · FORM"}</small>
        </div>
      </div>
    </div>
  );
}
