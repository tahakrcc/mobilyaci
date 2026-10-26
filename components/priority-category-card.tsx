"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";

type PriorityCategoryCardProps = {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  images: string[];
  number: string;
  order: number;
};

export function PriorityCategoryCard({ href, title, eyebrow, description, images, number, order }: PriorityCategoryCardProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = window.setTimeout(() => {
      setActiveImage((current) => (current + 1) % images.length);
      interval = setInterval(() => setActiveImage((current) => (current + 1) % images.length), 5200);
    }, 1800 + order * 850);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [images.length, order]);

  return <a className="priority-card blur-reveal" href={href}>
    <div className="priority-card-media" aria-hidden="true">
      {images.map((image, index) => (
        index === activeImage || index === (activeImage + 1) % images.length || (activeImage > 0 && index === activeImage - 1)
          ? <SiteImage className={index === activeImage ? "active" : ""} src={image} alt="" key={image} />
          : null
      ))}
    </div>
    <span>{number}</span>
    <div className="priority-card-copy"><small>{eyebrow}</small><h3>{title}</h3><p>{description}</p><ArrowUpRight /></div>
    {images.length > 1 && <div className="priority-card-progress" aria-hidden="true">{images.map((image, index) => <i className={index === activeImage ? "active" : ""} key={image} />)}</div>}
  </a>;
}
