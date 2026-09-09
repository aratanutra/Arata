import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import PolicyPage from "@/components/public/PolicyPage";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AeternyxFloat from "@/components/public/AeternyxFloat";

export const metadata: Metadata = {
  title: "Refund & Cancellation · Arata Nutraceuticals",
  description:
    "How to cancel an order or seek a refund on a product purchased through aratanutra.com."
};

export default async function RefundCancellationPage() {
  const content = await readContent();
  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />
      <PolicyPage
        document={content.policies.refundCancellation}
        grievance={content.policies.grievance}
        updatedAt={content.policies.updatedAt}
      />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
      <AeternyxFloat />
    </main>
  );
}
