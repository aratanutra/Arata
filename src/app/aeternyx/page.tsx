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
import Prescription from "@/components/public/Prescription";
import Faq from "@/components/public/Faq";
import Newsletter from "@/components/public/Newsletter";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

export const metadata: Metadata = {
  title: "AETERNYX® · Cellular Intelligence™ | Arata Nutraceuticals",
  description:
    "The complete physician-formulated longevity protocol. Ten RCT-graded bioactives, five cellular ageing pathways, one daily tablet."
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
      <Prescription data={content.prescription} />
      <Faq data={content.faq} />
      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
