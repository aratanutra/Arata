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
  title: "AETERNYX® · Cellular Intelligence™ | Arata Nutraceuticals",
  description:
    "AETERNYX® is a physician-formulated longevity nutraceutical: ten RCT-graded bioactives across five cellular ageing pathways in a single daily tablet.",
  openGraph: {
    title: "AETERNYX® · Cellular Intelligence™",
    description:
      "A single tablet. Ten bioactives. Five cellular ageing pathways. Engineered by physicians.",
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
