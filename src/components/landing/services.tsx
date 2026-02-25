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
        { opacity: 0, y: 50 },
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
    linkKey: linkKeyMap[key] || "hotels",
  }));

  return (
    <section className="marketing-section bg-background">
      <div
        ref={containerRef}
        className="marketing-container"
      >
        <SectionTitle
          overline={t("overline")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
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
  };
}) {
  return (
    <Link
      href={`/plan-trip?service=${service.linkKey}`}
      className="service-card group relative overflow-hidden aspect-[4/5] block bg-muted rounded-2xl border border-border/50 shadow-card"
    >
      <div className="absolute inset-0">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-colors duration-300" />
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div
            className="w-8 h-px bg-primary mb-4"
            aria-hidden="true"
          />
          <h3 className="text-2xl font-display font-medium uppercase text-white tracking-tight mb-2">
            {service.title}
          </h3>
          <p className="text-white/70 font-light text-sm leading-relaxed text-pretty">
            {service.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
