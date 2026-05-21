import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Aeternyx™ — Cellular Intelligence | ARATA Nutraceuticals",
  description:
    "Aeternyx™ is a physician-formulated longevity protocol: ten RCT-grade bioactives addressing five hallmarks of aging in a single daily capsule.",
  openGraph: {
    title: "Aeternyx™ — Cellular Intelligence",
    description:
      "A single capsule. Ten bioactives. Five aging pathways. Engineered by physicians.",
    type: "website"
  },
  metadataBase: new URL("https://aeternyx.com")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
