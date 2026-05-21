import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Hero from "@/components/public/Hero";
import TrustBar from "@/components/public/TrustBar";
import HomeFeatured from "@/components/public/HomeFeatured";
import HomeValues from "@/components/public/HomeValues";
import Philosophy from "@/components/public/Philosophy";
import Blog from "@/components/public/Blog";
import Newsletter from "@/components/public/Newsletter";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";

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
      <Blog data={content.blog} />
      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}
