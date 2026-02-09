import {
  CTA,
  FAQ,
  Footer,
  Hero,
  Destinations,
  Services,
  SocialProof,
  ExperienceShowcase,
  Gallery,
  Testimonials,
  WhyUs,
  HowItWorks,
} from "@/components/landing";
import { Navbar } from "@/components/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vizit Africa | Curated Travel Experiences in Rwanda",
  description:
    "Experience the best of Rwanda with custom travel packages. From gorilla trekking to Kigali city tours, we handle flights, hotels, and guides.",
  openGraph: {
    title: "Vizit Africa | Curated Travel Experiences in Rwanda",
    description:
      "Experience the best of Rwanda with custom travel packages. From gorilla trekking to Kigali city tours, we handle flights, hotels, and guides.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vizit Africa Travel Experience",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Vizit Africa",
  image: "https://vizitafrica.com/logo.png",
  description: "Professional travel planning for your Rwanda experience.",
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
  url: "https://vizitafrica.com",
  telephone: "+250788123456",
  priceRange: "$$$",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <SocialProof />
      <Services />
      <Destinations />
      <ExperienceShowcase />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <WhyUs />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
