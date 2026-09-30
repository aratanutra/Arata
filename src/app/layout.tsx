import type { Metadata, Viewport } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/public/Analytics";
import CookieConsent from "@/components/public/CookieConsent";

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
  title: {
    default:
      "AETERNYX® — One tablet. Ten bioactives. Cellular Intelligence™ | Arata Nutraceuticals",
    template: "%s | Arata Nutraceuticals"
  },
  description:
    "An expertly composed healthspan nutraceutical: ten evidence-graded bioactives across five cellular ageing pathways in one daily vegetarian tablet. Made in India, FSSAI-licensed. Shipping India-wide.",
  keywords: [
    "AETERNYX",
    "Arata Nutraceuticals",
    "healthspan supplement India",
    "longevity supplement India",
    "cellular wellness supplement",
    "single tablet multivitamin",
    "NMN India",
    "tocotrienols India",
    "resveratrol India",
    "vitamin D3 K2 MK7 India",
    "premium nutraceutical India",
    "evidence based supplement",
    "vegetarian longevity tablet",
    "sirtuin activator supplement",
    "mitochondrial support India",
    "healthspan vs lifespan"
  ],
  applicationName: "Arata Nutraceuticals",
  authors: [{ name: "Arata Nutraceuticals" }],
  creator: "Arata Nutraceuticals",
  publisher: "Arata Nutraceuticals",
  category: "health",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    url: "https://aratanutra.com",
    siteName: "Arata Nutraceuticals",
    title: "AETERNYX® · Cellular Intelligence™",
    description:
      "One tablet, opened up — ten evidence-graded bioactives across five cellular ageing pathways.",
    locale: "en_IN",
    images: [
      {
        url: "/aeternyx-og.jpg",
        secureUrl: "https://aratanutra.com/aeternyx-og.jpg",
        type: "image/jpeg",
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
    images: ["/aeternyx-og.jpg"]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5EFE4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" }
  ],
  width: "device-width",
  initialScale: 1
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arata Nutraceuticals",
  legalName: "Arata Nutraceuticals",
  url: "https://aratanutra.com",
  logo: "https://aratanutra.com/brand/arata-mark-navy.png",
  email: "aratanutra@gmail.com",
  telephone: "+91-9959993973",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Flat No. 107, Vasantha Green View, Sy No. 79 of Hafeezpet, Miyapur",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500049",
    addressCountry: "IN"
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "aratanutra@gmail.com",
      telephone: "+91-9959993973",
      areaServed: "IN",
      availableLanguage: ["en", "hi", "te"]
    }
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61590023834198",
    "https://www.facebook.com/profile.php?id=61590015399900"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-sans bg-canvas text-ink antialiased">
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
