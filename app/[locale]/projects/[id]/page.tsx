import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { InnerHero, InnerShell, InquiryBand } from "@/components/inner-page";
import { isLocale } from "@/lib/catalog";
import { local, projects } from "@/lib/site-content";

export default async function ProjectDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params; if (!isLocale(rawLocale)) notFound(); const project = projects.find((item) => item.id === id); if (!project) notFound(); const locale = rawLocale; const tr = locale === "tr";
  return <InnerShell locale={locale}><InnerHero locale={locale} eyebrow={local(project.type, locale)} title={local(project.title, locale)} lead={local(project.story, locale)} image={project.image} index={`${project.place.toUpperCase()} / ${project.year}`} />
    <section className="project-story"><div className="blur-reveal"><p className="eyebrow">{tr ? "MEKÂN VE PARÇA" : "PLACE AND PIECE"}</p><h2>{tr ? "Önce ortamı dinledik, sonra ağacı seçtik." : "We listened to the room before choosing the wood."}</h2></div><div className="blur-reveal"><p>{local(project.story, locale)}</p><p>{tr ? "Renk, oran ve yüzey kararları numune ve gerçek plaka görüntüleri üzerinden birlikte netleştirildi. Sonuç, yalnızca bu mekân için üretilen tek bir parçadır." : "Color, proportion and finish were agreed through samples and images of the actual slab. The result is a single piece made only for this place."}</p><dl><div><dt>{tr ? "Konum" : "Location"}</dt><dd>{project.place}</dd></div><div><dt>{tr ? "Yıl" : "Year"}</dt><dd>{project.year}</dd></div><div><dt>{tr ? "Kapsam" : "Scope"}</dt><dd>{local(project.type, locale)}</dd></div></dl></div></section>
    <section className="project-full-image"><img src={project.image} alt={local(project.title, locale)} /></section><div className="detail-back"><Link href={`/${locale}/projects`}><ArrowLeft />{tr ? "Tüm projeler" : "All projects"}</Link></div><InquiryBand locale={locale} /></InnerShell>;
}
