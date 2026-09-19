import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import AeternyxFloat from "@/components/public/AeternyxFloat";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact · Arata Nutraceuticals",
  description:
    "How to reach Arata Nutraceuticals — customer support, WhatsApp, grievance officer for consumer, content and personal-data complaints."
};

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z" />
    </svg>
  );
}

export default async function ContactPage() {
  const content = await readContent();
  const brand = content.brand;
  const grievance = content.policies.grievance;
  const waDigits = brand.whatsappNumber.replace(/\D/g, "");
  const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(brand.whatsappGreeting)}`;

  return (
    <main className="relative bg-canvas">
      <Nav brand={brand} nav={content.nav} />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.08)_0%,_transparent_60%)]"
        />
        <div className="container-app relative">
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Get in touch</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Contact us
            </h1>
            <p className="mt-4 lede">
              Questions, order updates, or a grievance — the fastest channel is WhatsApp; email
              works for anything you'd rather have in writing.
            </p>

            {/* Everyday contact */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-hairline bg-paper p-6">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                  Customer support
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                  Order queries, product questions, tracking, refunds. Monday–Saturday, 9:00–18:00
                  IST. We aim to reply within one working day.
                </p>
                <div className="mt-4 space-y-2 text-[14px] text-ink md:text-[15px]">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                      Email
                    </span>
                    <br />
                    <a
                      href={`mailto:${brand.email}`}
                      className="underline decoration-hairline underline-offset-4 hover:text-gold-deep hover:decoration-gold-deep"
                    >
                      {brand.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                      Phone
                    </span>
                    <br />
                    <span className="tnum">{brand.phone}</span>
                  </div>
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-95 hover:shadow-card-hover"
                >
                  <WhatsAppGlyph className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="rounded-2xl border border-hairline bg-paper p-6">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                  Registered office
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                  Correspondence, legal notices, returns dispatched by pre-approved reverse pickup.
                </p>
                <address className="mt-4 not-italic text-[14px] leading-relaxed text-ink md:text-[15px]">
                  Arata Nutraceuticals
                  <br />
                  Flat No. 107, Vasantha Green View
                  <br />
                  Sy No. 79 of Hafeezpet, Miyapur
                  <br />
                  Hyderabad 500049, Telangana, India
                </address>
                <div className="mt-4 grid gap-2 text-[13px] text-ink-soft md:text-[14px]">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      FSSAI Marketer Lic.
                    </span>{" "}
                    <span className="tnum">{brand.fssaiLicense}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      FSSAI Manufacturer Lic.
                    </span>{" "}
                    <span className="tnum">{brand.fssaiManufacturerLicense}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      Country of origin
                    </span>{" "}
                    India
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance officer */}
            <div className="mt-12 rounded-2xl border border-hairline bg-canvas p-6 md:p-8">
              <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    Grievance Officer & Data Protection Officer
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    {grievance.name ?? grievance.designation}
                  </h2>
                </div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-muted md:text-right">
                  {grievance.hours}
                </div>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
                For consumer complaints under the Consumer Protection (E-Commerce) Rules, 2020;
                content and intermediary complaints under the Information Technology (Intermediary
                Guidelines and Digital Media Ethics Code) Rules, 2021; and any request concerning
                your personal data under the Digital Personal Data Protection Act, 2023.
              </p>

              <dl className="mt-5 grid gap-3 text-[14px] leading-relaxed text-ink md:grid-cols-2 md:text-[15px]">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Direct email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${grievance.email}`}
                      className="underline decoration-hairline underline-offset-4 hover:text-gold-deep hover:decoration-gold-deep"
                    >
                      {grievance.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Direct phone
                  </dt>
                  <dd className="mt-1 tnum">{grievance.phone}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                    Address for legal notices
                  </dt>
                  <dd className="mt-1 text-ink-soft">{grievance.address}</dd>
                </div>
              </dl>

              {grievance.responseTimes?.note ? (
                <p className="mt-6 rounded-xl border border-hairline bg-paper p-4 text-[13px] leading-relaxed text-ink-soft md:text-[14px]">
                  {grievance.responseTimes.note}
                </p>
              ) : null}
            </div>

            {/* Related policies */}
            <div className="mt-10 flex flex-wrap gap-3 text-[12px] font-medium uppercase tracking-widest text-muted">
              <span className="mr-2 text-ink-soft">Read more:</span>
              <a href="/privacy" className="hover:text-gold-deep">Privacy</a>
              <span>·</span>
              <a href="/terms" className="hover:text-gold-deep">Terms</a>
              <span>·</span>
              <a href="/refund-and-cancellation" className="hover:text-gold-deep">Refund &amp; Cancellation</a>
              <span>·</span>
              <a href="/return-policy" className="hover:text-gold-deep">Returns</a>
              <span>·</span>
              <a href="/shipping-policy" className="hover:text-gold-deep">Shipping</a>
            </div>
          </div>
        </div>
      </section>

      <Footer brand={brand} footer={content.footer} />
      <WhatsAppFloat number={brand.whatsappNumber} greeting={brand.whatsappGreeting} />
      <AeternyxFloat />
    </main>
  );
}
