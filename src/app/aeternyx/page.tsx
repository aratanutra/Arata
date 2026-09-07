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

export const metadata: Metadata = {
  title: "AETERNYX® · Cellular Intelligence™ | Arata Nutraceuticals",
  description:
    "The complete expertly composed healthspan nutraceutical. Ten evidence-graded bioactives, five cellular wellness pathways, one daily tablet. M.R.P. ₹800 per strip of 10 tablets."
};

export default async function AeternyxPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <IngredientExplorer data={content.ingredientsSection} />
      <CompositionTable data={content.compositionTable} />
      <ProductHero brand={content.brand} hero={content.productHero} />
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
