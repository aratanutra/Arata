import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import ProductHero from "@/components/public/ProductHero";
import TrustBar from "@/components/public/TrustBar";
import CompositionTable from "@/components/public/CompositionTable";
import HowToUse from "@/components/public/HowToUse";
import Certifications from "@/components/public/Certifications";
import Faq from "@/components/public/Faq";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import LaunchBanner from "@/components/public/LaunchBanner";
import ReviewsSection, { fetchAggregateRating, fetchReviewsForJsonLd } from "@/components/public/ReviewsSection";
import { ORDERING_ENABLED } from "@/lib/ordering";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "AETERNYX® | Arata Nutraceuticals"
  },
  description:
    "AETERNYX® – nutraceutical tablet with CoQ10, resveratrol, alpha-lipoic acid, vitamins C, E, D3, K2, lycopene, astaxanthin and selenium. One tablet daily. Marketed by Arata Nutraceuticals, Hyderabad.",
  alternates: {
    canonical: "/aeternyx"
  },
  openGraph: {
    type: "website",
    url: "https://aratanutra.com/aeternyx",
    title: "AETERNYX® | Arata Nutraceuticals",
    description:
      "AETERNYX® – nutraceutical tablet with ten declared actives. One tablet daily. Marketed by Arata Nutraceuticals, Hyderabad."
  }
};

export default async function AeternyxPage() {
  const content = await readContent();
  const aggregateRating = await fetchAggregateRating();
  const reviewsForJsonLd = await fetchReviewsForJsonLd(5);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AETERNYX®",
    alternateName: "AETERNYX",
    description:
      "AETERNYX® – nutraceutical tablet with CoQ10, resveratrol, alpha-lipoic acid, vitamins C, E, D3, K2, lycopene, astaxanthin and selenium. One tablet daily.",
    image: "https://aratanutra.com/aeternyx-og.jpg",
    sku: "AETERNYX-STRIP-10",
    mpn: "AETERNYX-B01",
    brand: {
      "@type": "Brand",
      name: "AETERNYX"
    },
    manufacturer: {
      "@type": "Organization",
      name: "SunBeam Lifesciences Pvt. Ltd."
    },
    category: "Health & Wellness > Nutraceutical",
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 18
    },
    ...(aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.average,
            reviewCount: aggregateRating.count,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {}),
    ...(reviewsForJsonLd.length
      ? {
          review: reviewsForJsonLd.map((r) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1
            },
            author: {
              "@type": "Person",
              name: `${r.name}${r.state ? `, ${r.state}` : ""}`
            },
            name: r.title,
            reviewBody: r.body,
            datePublished: r.approvedAt ?? r.createdAt
          }))
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: "https://aratanutra.com/aeternyx",
      priceCurrency: "INR",
      price: content.productHero.packs?.[0]?.priceNumber ?? 800,
      validFrom: "2026-10-20",
      priceValidUntil: "2027-10-20",
      availability: ORDERING_ENABLED && !content.orderStatus.blocked
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      areaServed: "IN",
      seller: {
        "@type": "Organization",
        name: "Arata Nutraceuticals"
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 2,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        merchantReturnLink: "https://aratanutra.com/return-policy"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN"
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: content.productHero.packs?.[0]?.shippingCost ?? 0,
          currency: "INR"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY"
          }
        }
      }
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <main className="relative bg-canvas">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LaunchBanner banner={content.launchBanner} orderStatus={content.orderStatus} />
      <Nav brand={content.brand} nav={content.nav} />
      <ProductHero brand={content.brand} hero={content.productHero} orderStatus={content.orderStatus} />
      <CompositionTable data={content.compositionTable} />
      <TrustBar data={content.trustBar} />
      <HowToUse data={content.howToUse} />
      <Certifications data={content.certifications} />
      <ReviewsSection />
      <Faq data={content.faq} />
      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
