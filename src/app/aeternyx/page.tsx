import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import ProductHero from "@/components/public/ProductHero";
import TrustBar from "@/components/public/TrustBar";
import InteractiveTablet from "@/components/public/InteractiveTablet";
import Ingredients from "@/components/public/Ingredients";
import HowToUse from "@/components/public/HowToUse";
import Benefits from "@/components/public/Benefits";
import Science from "@/components/public/Science";
import Certifications from "@/components/public/Certifications";
import Faq from "@/components/public/Faq";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

export const metadata: Metadata = {
  title: "AETERNYX™ · Cellular Intelligence™ | Arata Nutraceuticals",
  description:
    "The complete expertly composed healthspan nutraceutical. Ten evidence-graded bioactives, five cellular wellness pathways, one daily tablet. M.R.P. ₹800 per strip of 10 tablets."
};

export default async function AeternyxPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <ProductHero brand={content.brand} hero={content.productHero} />
      <TrustBar data={content.trustBar} />
      <InteractiveTablet data={content.ingredientsSection} />
      <Ingredients data={content.ingredientsSection} />
      <HowToUse data={content.howToUse} />
      <Benefits data={content.benefits} />
      <Science data={content.science} />
      <Certifications data={content.certifications} />
      <Faq data={content.faq} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
