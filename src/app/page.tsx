import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Hero from "@/components/public/Hero";
import TrustBar from "@/components/public/TrustBar";
import Product from "@/components/public/Product";
import Ingredients from "@/components/public/Ingredients";
import Science from "@/components/public/Science";
import Benefits from "@/components/public/Benefits";
import Philosophy from "@/components/public/Philosophy";
import Prescription from "@/components/public/Prescription";
import Blog from "@/components/public/Blog";
import Newsletter from "@/components/public/Newsletter";
import Footer from "@/components/public/Footer";

export const revalidate = 0;

export default async function HomePage() {
  const content = await readContent();
  return (
    <main className="relative overflow-hidden bg-obsidian">
      <Nav brand={content.brand} nav={content.nav} />
      <Hero brand={content.brand} hero={content.hero} />
      <TrustBar data={content.trustBar} />
      <Product brand={content.brand} product={content.product} />
      <Ingredients data={content.ingredientsSection} />
      <Science data={content.science} />
      <Benefits data={content.benefits} />
      <Philosophy data={content.philosophy} />
      <Prescription data={content.prescription} />
      <Blog data={content.blog} />
      <Newsletter data={content.newsletter} />
      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
