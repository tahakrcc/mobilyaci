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
      const remaining = Math.max(0, 1500 - (performance.now() - startedAt));
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
      <div className="classic-loader" aria-hidden="true">
        <div className="classic-loader-brand"><span>WU</span><strong>WOODEN<br />UNIVERSE</strong></div>
        <div className="classic-loader-rings">
          <i /><i /><i /><i />
          <b>WU</b>
        </div>
        <p>{tr ? "ATÖLYE HAZIRLANIYOR" : "PREPARING THE WORKSHOP"}</p>
        <small>{tr ? "Ahşap, tasarım ve zanaat yükleniyor" : "Loading wood, design and craftsmanship"}</small>
        <div className="classic-loader-progress"><i /></div>
      </div>
    </div>
  );
}
