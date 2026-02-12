import {
  CTA,
  FAQ,
  Hero,
  PopularRoutes,
  Destinations,
  Services,
  SocialProof,
  Testimonials,
  WhyUs,
  HowItWorks,
} from "@/components/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vizit Africa | Book Flights to Rwanda & Africa",
  description:
    "Find and book the best flights to Rwanda. Add hotels, car rentals, and local guides to complete your African adventure.",
  openGraph: {
    title: "Vizit Africa | Book Flights to Rwanda & Africa",
    description:
      "Find and book the best flights to Rwanda. Add hotels, car rentals, and local guides to complete your African adventure.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vizit Africa — Book Flights to Rwanda",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "OnlineBusiness"],
  name: "Vizit Africa",
  image: "https://vizit.africa/logo.png",
  description:
    "Book flights to Rwanda and Africa. Add hotels, car rentals, and local guides.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "KN 3 Ave",
    addressLocality: "Kigali",
    addressCountry: "RW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-1.9441",
    longitude: "30.0619",
  },
  url: "https://vizit.africa",
  telephone: "+250788123456",
  priceRange: "$$$",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint: schema markup requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <SocialProof />

      <section className="py-20 md:py-28 bg-background">
        <div className="container max-w-7xl mx-auto px-5 md:px-10">
          <PopularRoutes />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container max-w-7xl mx-auto px-5 md:px-10">
          <Destinations />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container max-w-7xl mx-auto px-5 md:px-10">
          <Services />
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <WhyUs />
      <FAQ />
      <CTA />
    </>
  );
}
