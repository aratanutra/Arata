import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import TrustBar from "@/components/public/TrustBar";
import Product from "@/components/public/Product";
import Ingredients from "@/components/public/Ingredients";
import Science from "@/components/public/Science";
import Benefits from "@/components/public/Benefits";
import Prescription from "@/components/public/Prescription";
import Newsletter from "@/components/public/Newsletter";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";
import AeternyxPageHero from "@/components/public/AeternyxPageHero";

export const metadata: Metadata = {
  title: "Aeternyx™ — Cellular Intelligence | Arata Nutraceuticals",
  description:
    "The complete physician-formulated longevity protocol. Ten RCT-grade bioactives, five aging pathways, one daily capsule."
};

export default async function AeternyxPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <AeternyxPageHero brand={content.brand} page={content.aeternyxPage} />
      <TrustBar data={content.trustBar} />
      <Product brand={content.brand} product={content.product} />
      <Ingredients data={content.ingredientsSection} />
      <Science data={content.science} />
      <Benefits data={content.benefits} />
      <Prescription data={content.prescription} />
      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}
