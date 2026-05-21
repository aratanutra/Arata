import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Syncopate } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

const accent = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-accent",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${accent.variable}`}>
      <body className="font-body bg-obsidian text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
