import {
  CTA,
  FAQ,
  Footer,
  Hero,
  Services,
  Partners,
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
      <Hero />
      <Partners />
      <Services />
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
