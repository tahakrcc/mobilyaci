import type { Metadata } from "next";
import type { Locale } from "@/lib/catalog";

const logo = "/brand/wooden-universe-logo.webp";

export function pageMetadata(locale: Locale, title: string, description: string, path: string, image = logo): Metadata {
  const fullTitle = `${title} | WoodenUniverse`;
  const url = `/${locale}${path}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: { tr: `/tr${path}`, en: `/en${path}` },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "WoodenUniverse",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
      images: [{ url: image, alt: title }],
    },
  };
}
