import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/order-tracker";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isLocale } from "@/lib/catalog";

export default async function TrackPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <main className="public-site tracking-page"><SiteHeader locale={rawLocale} /><Suspense><OrderTracker locale={rawLocale} /></Suspense><SiteFooter locale={rawLocale} /></main>;
}
