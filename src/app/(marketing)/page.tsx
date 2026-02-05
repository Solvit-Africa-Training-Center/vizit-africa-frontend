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

export default function Home() {
  return (
    <>
      <Navbar />
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
