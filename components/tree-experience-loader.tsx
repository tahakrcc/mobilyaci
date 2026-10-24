"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/catalog";

function TreeLoading() {
  return (
    <section id="woods" className="tree-journey tree-loading" aria-label="3D sahne yükleniyor">
      <div className="grain-loader">
        <div className="grain-loader-brand"><span>WU</span><small>WOODEN UNIVERSE</small></div>
        <div className="grain-loader-rings" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
          <b />
        </div>
        <div className="grain-loader-copy">
          <span>3D DAMAR ATLASI</span>
          <strong>Malzemenin hafızası hazırlanıyor.</strong>
          <div className="grain-loader-progress"><i /></div>
          <small>WOOD · RESIN · FORM</small>
        </div>
      </div>
    </section>
  );
}

const TreeExperience = dynamic(() => import("@/components/tree-experience").then((module) => module.TreeExperience), {
  ssr: false,
  loading: () => <TreeLoading />,
});

export function TreeExperienceLoader({ locale }: { locale: Locale }) {
  const placeholder = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    const target = placeholder.current;
    if (!target) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setNearby(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNearby(true);
      observer.disconnect();
    }, { rootMargin: "800px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div ref={placeholder}>{nearby ? <TreeExperience locale={locale} /> : <TreeLoading />}</div>;
}
