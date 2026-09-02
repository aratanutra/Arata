import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Hero from "@/components/public/Hero";
import TrustBar from "@/components/public/TrustBar";
import HomeFeatured from "@/components/public/HomeFeatured";
import HomeValues from "@/components/public/HomeValues";
import Philosophy from "@/components/public/Philosophy";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";

export default async function HomePage() {
  const content = await readContent();
  return (
    <main className="relative overflow-hidden bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <Hero hero={content.hero} />
      <TrustBar data={content.trustBar} />
      <HomeFeatured data={content.homeFeatured} brand={content.brand} />
      <HomeValues data={content.homeValues} />
      <Philosophy data={content.philosophy} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
