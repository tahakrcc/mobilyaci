import Image from "next/image";
import { Download } from "lucide-react";
import type { Locale } from "@/lib/catalog";

type CatalogLookbookProps = {
  locale: Locale;
  section: "chairs" | "sets";
  pageCount: number;
};

export function CatalogLookbook({ locale, section, pageCount }: CatalogLookbookProps) {
  const tr = locale === "tr";
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const title = section === "chairs"
    ? (tr ? "Sandalye kataloğu" : "Seating catalogue")
    : (tr ? "Masa ve sandalye setleri" : "Table and chair sets");

  return <section className="catalog-lookbook" aria-labelledby={`${section}-catalogue-title`}>
    <header className="catalog-lookbook-toolbar">
      <div>
        <p className="eyebrow">WOODEN UNIVERSE · COLLECTION 2027</p>
        <h2 id={`${section}-catalogue-title`}>{title}</h2>
      </div>
      <div className="catalog-lookbook-meta">
        <span>{String(pageCount).padStart(2, "0")} {tr ? "SAYFA" : "PAGES"}</span>
        <a href="/catalog/Wooden_Universe_Collection_2027.pdf" download>
          <Download aria-hidden="true" />{tr ? "Tüm kataloğu indir" : "Download full catalogue"}
        </a>
      </div>
    </header>
    <p className="catalog-lookbook-hint">{tr ? "Tüm modelleri görmek için aşağı kaydırın. Mobilde sayfalar tek tek gösterilir." : "Scroll to view every model. Pages are shown one by one on mobile."}</p>
    <ol className="catalog-lookbook-pages">
      {pages.map((page) => <li key={page}>
        <figure>
          <Image
            src={`/images/catalog/lookbook/${section}/page-${String(page).padStart(2, "0")}.webp`}
            alt={`${title} · ${tr ? "sayfa" : "page"} ${page}`}
            width={1488}
            height={2105}
            sizes="(max-width: 760px) calc(100vw - 32px), 44vw"
            priority={page <= 2}
          />
          <figcaption>{String(page).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</figcaption>
        </figure>
      </li>)}
    </ol>
  </section>;
}
