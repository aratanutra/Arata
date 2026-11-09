import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AeternyxFloat from "@/components/public/AeternyxFloat";
import AboutHero from "@/components/public/AboutHero";
import AboutStory from "@/components/public/AboutStory";
import AboutValues from "@/components/public/AboutValues";
import AboutClosing from "@/components/public/AboutClosing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "About Arata Nutraceuticals"
  },
  description:
    "Arata Nutraceuticals is a nutraceutical brand based in Hyderabad, India. AETERNYX® is our first product.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    type: "website",
    url: "https://aratanutra.com/about",
    title: "About Arata Nutraceuticals",
    description:
      "Arata Nutraceuticals is a nutraceutical brand based in Hyderabad, India. AETERNYX® is our first product."
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
      <AboutClosing data={content.about.closingCta} brand={content.brand} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
      <AeternyxFloat />
    </main>
  );
}
