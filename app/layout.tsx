import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://woodenuniverse.com"),
  title: { default: "WoodenUniverse", template: "%s · WoodenUniverse" },
  description: "Özel ahşap ve epoksi mobilyalar. Ağacınızı keşfedin, kişisel tasarım talebinizi oluşturun ve üretimi takip edin.",
  icons: {
    icon: "/brand/wooden-universe-favicon.png",
    shortcut: "/brand/wooden-universe-favicon.png",
    apple: "/brand/wooden-universe-mark.png",
  },
  openGraph: {
    title: "WoodenUniverse",
    description: "Özel ahşap ve epoksi mobilyalar.",
    images: [{ url: "/brand/wooden-universe-logo.webp", width: 640, height: 640, alt: "WoodenUniverse logosu" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
