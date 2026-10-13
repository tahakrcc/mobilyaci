"use client";

import dynamic from "next/dynamic";
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
  return <TreeExperience locale={locale} />;
}
