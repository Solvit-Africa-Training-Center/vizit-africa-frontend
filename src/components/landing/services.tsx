"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "./section-title";

gsap.registerPlugin(ScrollTrigger);

const serviceImages = [
  "/images/hotel.jpg",
  "/images/tourism-guide-vehicle-car.jpg",
  "/images/guide.jpg",
];

const serviceKeys = ["hotels", "experiences", "transfers"] as const;

const linkKeyMap: Record<string, string> = {
  hotels: "hotels",
  experiences: "cars",
  transfers: "guides",
};

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Services");

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".service-card");
      if (!cards) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: containerRef },
  );

  const services = serviceKeys.map((key, index) => ({
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`),
    image: serviceImages[index],
    linkKey: linkKeyMap[key] || "hotels",
    number: `0${index + 1}`,
  }));

  return (
    <section className="marketing-section bg-surface-canvas overflow-hidden">
      <div ref={containerRef} className="marketing-container">
        <SectionTitle
          overline={t("overline")}
          title={t("title")}
          description={t("description")}
        />

        <div className="flex flex-col md:flex-row mt-16 lg:mt-24 border-y border-border-warm divide-y md:divide-y-0 md:divide-x divide-border-warm bg-border-warm gap-px">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
}: {
  service: {
    title: string;
    description: string;
    image: string;
    linkKey: string;
    number: string;
  };
}) {
  return (
    <Link
      href={`/plan-trip?service=${service.linkKey}`}
      className="service-card group w-full md:w-1/3 flex flex-col relative bg-surface-cream hover:bg-white transition-colors duration-500 min-h-[400px]"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-10" />

      <div className="p-8 md:p-10 flex flex-col grow relative z-10">
        <div className="font-mono text-xs text-surface-ink/40 mb-12 flex items-center justify-between">
          <span>{service.number}</span>
          <div className="w-8 h-8 rounded-full border border-surface-ink/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>

        <div className="mt-auto">
          <h3 className="text-3xl lg:text-4xl font-display font-medium text-surface-ink mb-4 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          <p className="font-sans text-surface-ink/60 font-light text-sm leading-relaxed max-w-[280px]">
            {service.description}
          </p>
        </div>
      </div>

      {/* Decorative background image that fades in on hover */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <Image
          src={service.image}
          alt={`Background image for ${service.title}`}
          fill
          sizes="33vw"
          className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out grayscale mix-blend-multiply"
        />
      </div>
    </Link>
  );
}
