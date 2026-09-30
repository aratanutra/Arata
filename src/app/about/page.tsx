import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Philosophy from "@/components/public/Philosophy";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AeternyxFloat from "@/components/public/AeternyxFloat";
import AboutHero from "@/components/public/AboutHero";
import AboutStory from "@/components/public/AboutStory";
import AboutValues from "@/components/public/AboutValues";
import AboutClosing from "@/components/public/AboutClosing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Arata Nutraceuticals — evidence-first healthspan from Hyderabad",
  description:
    "Arata Nutraceuticals is building India's most rigorously composed nutraceutical portfolio — audited to global standards, dosed to matter, made for the long game.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    type: "website",
    url: "https://aratanutra.com/about",
    title: "About Arata Nutraceuticals",
    description:
      "Evidence-first healthspan brand from Hyderabad. Rigorously composed, expertly dosed, made for the long game."
  }
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
      <AeternyxFloat />
    </main>
  );
}
