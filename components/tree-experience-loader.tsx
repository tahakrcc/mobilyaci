"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/lib/catalog";

const TreeExperience = dynamic(() => import("@/components/tree-experience").then((module) => module.TreeExperience), {
  ssr: false,
  loading: () => <section id="woods" className="tree-journey tree-loading"><div><span /><p>3D GRAIN ATLAS</p></div></section>,
});

export function TreeExperienceLoader({ locale }: { locale: Locale }) {
  return <TreeExperience locale={locale} />;
}
