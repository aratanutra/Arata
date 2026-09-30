import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import ProductHero from "@/components/public/ProductHero";
import TrustBar from "@/components/public/TrustBar";
import IngredientExplorer from "@/components/public/IngredientExplorer";
import CompositionTable from "@/components/public/CompositionTable";
import MetricsPanel from "@/components/public/MetricsPanel";
import HowToUse from "@/components/public/HowToUse";
import Benefits from "@/components/public/Benefits";
import FiveDrivers from "@/components/public/FiveDrivers";
import Certifications from "@/components/public/Certifications";
import Faq from "@/components/public/Faq";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import LaunchBanner from "@/components/public/LaunchBanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AETERNYX® — The single healthspan tablet · Composition, science, price",
  description:
    "Ten evidence-graded bioactives in one vegetarian tablet — supporting NAD⁺, sirtuin, mitochondrial, redox and inflammatory pathways of cellular ageing. FSSAI-licensed. M.R.P. ₹800 per strip of 10 tablets.",
  alternates: {
    canonical: "/aeternyx"
  },
  openGraph: {
    type: "website",
    url: "https://aratanutra.com/aeternyx",
    title: "AETERNYX® — The single healthspan tablet",
    description:
      "Ten evidence-graded bioactives across five cellular ageing pathways in one daily vegetarian tablet."
  }
};

export default async function AeternyxPage() {
  const content = await readContent();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AETERNYX®",
    alternateName: "AETERNYX Cellular Intelligence",
    description:
      "An expertly composed healthspan nutraceutical: ten evidence-graded bioactives across five cellular ageing pathways in a single daily vegetarian tablet.",
    image: "https://aratanutra.com/aeternyx-og.jpg",
    brand: {
      "@type": "Brand",
      name: "AETERNYX"
    },
    manufacturer: {
      "@type": "Organization",
      name: "Arata Nutraceuticals"
    },
    category: "Health & Wellness > Nutraceutical",
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 18
    },
    offers: {
      "@type": "Offer",
      url: "https://aratanutra.com/aeternyx",
      priceCurrency: "INR",
      price: content.productHero.packs?.[0]?.priceNumber ?? 800,
      availability: content.orderStatus.blocked
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: "IN",
      seller: {
        "@type": "Organization",
        name: "Arata Nutraceuticals"
      }
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <main className="relative bg-canvas">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LaunchBanner banner={content.launchBanner} orderStatus={content.orderStatus} />
      <Nav brand={content.brand} nav={content.nav} />
      <IngredientExplorer data={content.ingredientsSection} />
      <CompositionTable data={content.compositionTable} />
      <ProductHero brand={content.brand} hero={content.productHero} orderStatus={content.orderStatus} />
      <TrustBar data={content.trustBar} />
      <MetricsPanel data={content.metricsPanel} />
      <HowToUse data={content.howToUse} />
      <Benefits data={content.benefits} />
      <FiveDrivers data={content.science} />
      <Certifications data={content.certifications} />
      <Faq data={content.faq} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
