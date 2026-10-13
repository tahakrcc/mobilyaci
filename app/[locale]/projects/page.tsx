import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { local, projects } from "@/lib/site-content";
import { resolveContent } from "@/lib/content-store";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params; if (!isLocale(rawLocale)) notFound(); const locale = rawLocale; const tr = locale === "tr";
  const content = await resolveContent(locale, { "projects.title": tr ? "Bir mekâna ait olmak için tasarlandı." : "Designed to belong to a place.", "projects.body": tr ? "Her proje, mekânın ışığına, kullanımına ve seçilen gerçek ahşap plakasına göre şekillenir." : "Every project is shaped by the light, use and actual slab selected for its space." });
  return <InnerShell locale={locale}><InnerHero locale={locale} eyebrow={tr ? "PROJELER" : "PROJECTS"} title={content["projects.title"]} lead={content["projects.body"]} image="/images/hero-olive-epoxy.webp" index="PROJECTS / 01" />
    <section className="project-index">{projects.map((project, index) => <Link className="project-tile blur-reveal" href={`/${locale}/projects/${project.id}`} key={project.id}><img src={project.image} alt={local(project.title, locale)} /><div><span>0{index + 1} · {project.place} · {project.year}</span><h2>{local(project.title, locale)}</h2><p>{local(project.type, locale)}</p><ArrowUpRight /></div></Link>)}</section><InquiryBand locale={locale} /></InnerShell>;
}
