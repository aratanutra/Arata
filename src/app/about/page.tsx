import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Philosophy from "@/components/public/Philosophy";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AboutHero from "@/components/public/AboutHero";
import AboutStory from "@/components/public/AboutStory";
import AboutValues from "@/components/public/AboutValues";
import AboutClosing from "@/components/public/AboutClosing";

export const metadata: Metadata = {
  title: "About Us · Arata Nutraceuticals",
  description:
    "Arata Nutraceuticals is a specialist healthspan laboratory based in Hyderabad, building India's most rigorously composed nutraceutical portfolio."
};

export default async function AboutPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <AboutHero hero={content.about.hero} />
      <AboutStory story={content.about.story} />
      <AboutValues values={content.about.values} />
      <Philosophy data={content.philosophy} />
      <AboutClosing data={content.about.closingCta} brand={content.brand} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
