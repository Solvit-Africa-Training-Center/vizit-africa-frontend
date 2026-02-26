import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CTA } from "@/components/landing/cta";
import { Destinations } from "@/components/landing/destinations";
import { FAQ } from "@/components/landing/faq";
// import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Services } from "@/components/landing/services";
import { SocialProof } from "@/components/landing/social-proof";
import { Testimonials } from "@/components/landing/testimonials";
import { WhyUs } from "@/components/landing/why-us";

const Hero = dynamic(
  () => import("@/components/landing/hero").then((m) => m.Hero),
  {
    ssr: true, // Keep SSR true for LCP but allow dynamic chunking
    loading: () => (
      <div className="h-[100dvh] w-full bg-[oklch(14%_0_0)] animate-pulse" />
    ),
  },
);

import { siteConfig } from "@/lib/configs";

export const metadata: Metadata = {
  title: siteConfig.name + " | Premium Travel to Rwanda & Africa",
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "Kesly Chloe", url: siteConfig.url }],
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Vizit Africa | Expert Curated Journeys to Rwanda",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Vizit Africa - Premium African Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vizit Africa | Travel Beyond the Ordinary",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: "https://vizit.africa/logo.png",
  image: "https://vizit.africa/images/rwanda-landscape.jpg",
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
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
  sameAs: [
    siteConfig.socials.facebook,
    siteConfig.socials.instagram,
    siteConfig.socials.linkedin,
    siteConfig.links.twitter,
  ],
  priceRange: "$$$",
  areaServed: {
    "@type": "Country",
    name: "Rwanda",
  },
  offers: {
    "@type": "Offer",
    itemOffered: [
      {
        "@type": "Service",
        name: "Flight Sourcing",
        description: "Manual sourcing for best flight fares to Rwanda.",
      },
      {
        "@type": "Service",
        name: "Luxury Accommodation",
        description: "Handpicked premium hotels across Rwanda.",
      },
    ],
  },
};

import { FeaturedExperience } from "@/components/landing/featured-experience";
import { StatsBar } from "@/components/landing/stats-bar";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint: schema markup requires dangerouslySetInnerHTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StatsBar />
      <SocialProof />
      <Services />
      <Destinations />
      {/* <FeaturedExperience /> */}
      <HowItWorks />
      <Testimonials />
      <WhyUs />
      <FAQ />
      <CTA />
    </>
  );
}
