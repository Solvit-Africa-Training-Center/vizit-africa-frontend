"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionTitle } from "./section-title";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const serviceImages = [
  "https://images.unsplash.com/photo-1436491865332-7a61a1042759?q=90&w=1600&auto=format&fit=crop", // Flight/Plane
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=90&w=1600&auto=format&fit=crop", // Hotel
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=90&w=1600&auto=format&fit=crop", // Car/Road
  "https://images.unsplash.com/photo-1596423736730-86d5267d32c9?q=90&w=1600&auto=format&fit=crop", // Guide/Map
];

const serviceKeys = ["flights", "hotels", "experiences", "transfers"] as const;

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Services");

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".service-card");
      if (!cards) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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
  }));

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <SectionTitle
          overline={t("overline")}
          title={t("title")}
          description={t("description")}
          className="max-w-2xl mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8 md:mt-0">
            {services.slice(0, 2).map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>

          <div className="flex flex-col gap-8 md:mt-12">
            {services.slice(2, 4).map((service, i) => (
              <ServiceCard key={i} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
}: {
  service: { title: string; description: string; image: string };
}) {
  return (
    <div className="service-card group relative overflow-hidden rounded-sm aspect-[4/3] md:aspect-[16/10]">
      <div className="absolute inset-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-12 h-[1px] bg-white/60 mb-4" aria-hidden="true" />
          <h3 className="text-3xl font-black uppercase text-white tracking-tight mb-2">
            {service.title}
          </h3>
          <p className="text-white/80 font-light text-lg">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
