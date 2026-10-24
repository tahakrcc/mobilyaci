import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  position?: string;
  mobilePosition?: string;
  unoptimized?: boolean;
};

export function SiteImage({ src, alt, className, priority = false, sizes = "(max-width: 768px) 100vw, 50vw", position = "center", mobilePosition, unoptimized = false }: Props) {
  const style = { "--image-position": position, "--mobile-image-position": mobilePosition ?? position } as CSSProperties;
  return <Image className={className} src={src} alt={alt} width={1600} height={1200} sizes={sizes} priority={priority} unoptimized={unoptimized} style={style} />;
}
