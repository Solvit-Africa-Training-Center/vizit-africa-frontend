"use client";

import { useRef } from "react";
import Image from "next/image";
import { RiArrowRightLine } from "@remixicon/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1546422724-3c4be0b20cb5?q=90&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=90&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=90&w=1600&auto=format&fit=crop",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1505245208761-ba872912fac0?q=90&w=1600&auto=format&fit=crop",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=90&w=1600&auto=format&fit=crop",
  },
];

export function ExperienceShowcase() {
  const t = useTranslations("LandingExperiences");
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const totalWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth + viewportWidth * 0.1;

      gsap.to(scrollContainer, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-background overflow-hidden"
    >
      <div ref={containerRef} className="h-full flex flex-col justify-center">
        <div className="container max-w-7xl mx-auto px-5 mb-12 shrink-0">
          <div className="max-w-2xl">
            <span className="block text-accent-warm uppercase tracking-widest text-xs font-bold mb-4">
              {t("overline")}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase text-foreground leading-[0.9] whitespace-pre-line">
              {t("title")}
            </h2>
          </div>
        </div>

        <div className="w-full pl-5 md:pl-[max(2rem,calc((100vw-80rem)/2))]">
          <div ref={scrollContainerRef} className="flex gap-6 w-max">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className="group relative h-[400px] w-[300px] md:h-[500px] md:w-[400px] shrink-0 overflow-hidden bg-muted rounded-none cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
              >
                <div className="w-full h-full relative overflow-hidden">
                  <Image
                    src={experience.image}
                    alt={t(`items.${experience.id}.title`)}
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-accent-warm text-xs uppercase tracking-widest font-bold block mb-2">
                    {t(`items.${experience.id}.location`)}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white uppercase mb-4 leading-none">
                    {t(`items.${experience.id}.title`)}
                  </h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-out">
                    <p className="text-white/80 line-clamp-3 mb-6 font-light text-sm leading-relaxed translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {t(`items.${experience.id}.description`)}
                    </p>
                    <button
                      type="button"
                      className="flex items-center gap-3 text-white text-xs uppercase tracking-widest font-bold transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {t("cta")}
                      <RiArrowRightLine size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
