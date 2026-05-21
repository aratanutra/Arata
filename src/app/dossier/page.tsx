import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import ContactDialog from "@/components/public/ContactDialog";
import DossierPicker from "@/components/public/DossierPicker";

export const metadata: Metadata = {
  title: "Clinical Dossier · Arata Nutraceuticals",
  description:
    "Download the Aeternyx™ clinical dossier tailored to your specialty. Intended for healthcare professionals."
};

export default async function DossierPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />

      <section className="pt-32 pb-10 md:pt-40 md:pb-16">
        <div className="container-app">
          <span className="eyebrow">{content.dossier.eyebrow}</span>
          <h1 className="mt-4 heading-lg max-w-3xl">{content.dossier.title}</h1>
          <p className="mt-5 max-w-2xl lede">{content.dossier.subtitle}</p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-app">
          <DossierPicker
            specialties={content.dossier.specialties}
            fallbackEmail={content.contactForm.fallbackEmail}
            footnote={content.dossier.footnote}
          />
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
      <ContactDialog contactForm={content.contactForm} />
    </main>
  );
}
