import { notFound } from "next/navigation";
import { OrderBuilder } from "@/components/order-builder";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/lib/catalog";

export default async function DesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <main className="public-site builder-page"><SiteHeader locale={rawLocale} /><OrderBuilder locale={rawLocale} /></main>;
}
