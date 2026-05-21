import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Philosophy from "@/components/public/Philosophy";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";
import AboutHero from "@/components/public/AboutHero";
import AboutStory from "@/components/public/AboutStory";
import AboutValues from "@/components/public/AboutValues";
import AboutClosing from "@/components/public/AboutClosing";

export const metadata: Metadata = {
  title: "About Us · Arata Nutraceuticals",
  description:
    "Arata Nutraceuticals is a physician-led longevity laboratory based in Hyderabad, building India's most clinically literate supplement portfolio."
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
      <AboutClosing data={content.about.closingCta} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}
