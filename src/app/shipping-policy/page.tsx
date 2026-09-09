import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import PolicyPage from "@/components/public/PolicyPage";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AeternyxFloat from "@/components/public/AeternyxFloat";

export const metadata: Metadata = {
  title: "Shipping Policy · Arata Nutraceuticals",
  description: "How and when Arata Nutraceuticals ships orders across India."
};

export default async function ShippingPolicyPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <PolicyPage
        document={content.policies.shipping}
        grievance={content.policies.grievance}
        updatedAt={content.policies.updatedAt}
      />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
      <AeternyxFloat />
    </main>
  );
}
