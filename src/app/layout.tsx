import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap"
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-script",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aratanutra.com"),
  title: "AETERNYX® · Cellular Intelligence™ | Arata Nutraceuticals",
  description:
    "AETERNYX® is an expertly composed healthspan nutraceutical: ten evidence-graded bioactives across five cellular wellness pathways in a single daily tablet.",
  openGraph: {
    type: "website",
    url: "https://aratanutra.com",
    siteName: "Arata Nutraceuticals",
    title: "AETERNYX® · Cellular Intelligence™",
    description:
      "One tablet, opened up — ten evidence-graded bioactives across five cellular ageing pathways.",
    images: [
      {
        url: "/aeternyx-og.png",
        width: 1200,
        height: 630,
        alt: "AETERNYX® — one tablet opened up, showing ten bioactives inside."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AETERNYX® · Cellular Intelligence™",
    description:
      "One tablet, opened up — ten evidence-graded bioactives across five cellular ageing pathways.",
    images: ["/aeternyx-og.png"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <body className="font-sans bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
