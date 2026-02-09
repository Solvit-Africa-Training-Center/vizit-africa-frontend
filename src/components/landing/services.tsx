"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SectionTitle } from "./section-title";

interface Service {
  title: string;
  description: string;
  className: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Luxury Flights",
    description: "Private charters & premium class access.",
    className: "md:col-span-2 md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1721402495451-41724ae641a4?q=90&w=1600&auto=format&fit=crop",
  },
  {
    title: "Curated Hotels",
    description: "From boutique lodges to 5-star resorts.",
    className: "md:col-span-1 md:row-span-1",
    image:
      "https://images.unsplash.com/photo-1756245994882-cf32d49fde5a?q=90&w=1600&auto=format&fit=crop",
  },
  {
    title: "Exclusive Experiences",
    description: "Gorilla trekking, tea plantations, and more.",
    className: "md:col-span-1 md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1609861517208-e5b7b4cd4b87?q=90&w=1600&auto=format&fit=crop",
  },
  {
    title: "VIP Transfers",
    description: "Seamless ground transportation.",
    className: "md:col-span-1 md:row-span-1",
    image:
      "https://images.unsplash.com/photo-1664760536218-44efb2696288?q=90&w=1600&auto=format&fit=crop",
  },
];

export function Services() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <SectionTitle
          overline="Our Services"
          title="World Class Services"
          description="We handle everything from the moment you leave your doorstep until you return, changed forever."
          className="max-w-2xl mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8 md:mt-0">
            {services.slice(0, 2).map((service, i) => (
              <ServiceCard key={i} service={service} index={i} />
            ))}
          </div>

          <div className="flex flex-col gap-8 md:mt-12">
            {services.slice(2, 4).map((service, i) => (
              <ServiceCard key={i} service={service} index={i + 2} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-sm aspect-[4/3] md:aspect-[16/10]"
    >
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
    </motion.div>
  );
}
