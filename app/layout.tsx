import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "WoodenUniverse", template: "%s · WoodenUniverse" },
  description: "Özel ahşap ve epoksi mobilyalar. Ağacınızı keşfedin, kişisel tasarım talebinizi oluşturun ve üretimi takip edin.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
