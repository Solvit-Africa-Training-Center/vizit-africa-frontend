"use client";

import { Navbar } from "@/components/shared";
import { Footer } from "@/components/landing";
import { teamMembers } from "@/lib/dummy-data";
import { RevealText } from "@/components/ui/reveal-text";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const t = useTranslations("About");
  const tCommon = useTranslations("Common");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const values = [
    {
      order: "01",
      title: t("values.1.title"),
      description: t("values.1.description"),
    },
    {
      order: "02",
      title: t("values.2.title"),
      description: t("values.2.description"),
    },
    {
      order: "03",
      title: t("values.3.title"),
      description: t("values.3.description"),
    },
    {
      order: "04",
      title: t("values.4.title"),
      description: t("values.4.description"),
    },
  ];

  useGSAP(
    () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const totalWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth + viewportWidth * 0.1;

      if (totalWidth > viewportWidth) {
        gsap.to(scrollContainer, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            start: "top 20%",
            end: `+=${scrollDistance}`,
            invalidateOnRefresh: true,
          },
        });
      }
    },
    { scope: containerRef },
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        <header className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
          <div className="flex flex-col gap-8">
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground block">
              {t("established")}
            </span>
            <h1 className="font-display text-7xl md:text-[10rem] font-medium uppercase tracking-tighter leading-[0.8] text-foreground">
              <RevealText text={t("title")} />
            </h1>
          </div>
        </header>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 md:col-start-3">
              <p className="font-display text-3xl md:text-5xl font-medium leading-tight indent-12 md:indent-24">
                <span className="text-primary">{t("intro1")}</span>{" "}
                {t("intro2")}
              </p>
              <p className="font-display text-3xl md:text-5xl font-medium leading-tight mt-12 text-muted-foreground/60">
                {t("intro3")}
              </p>
            </div>
          </div>
        </section>

        <section
          ref={containerRef}
          className="mb-32 md:mb-48 overflow-hidden py-12"
        >
          <div className="px-5 md:px-10 max-w-7xl mx-auto mb-12 flex items-end justify-between">
            <h2 className="font-display text-4xl md:text-6xl font-medium uppercase">
              {t("guidesTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xs text-right hidden md:block">
              {t("guidesDescription")}
            </p>
          </div>

          <div className="w-full">
            <div
              ref={scrollContainerRef}
              className="flex gap-8 px-5 md:px-10 w-max"
            >
              {teamMembers.map((member, i) => (
                <div
                  key={member.id}
                  className="relative w-[80vw] md:w-[25vw] aspect-[3/4] group shrink-0"
                >
                  <div className="absolute inset-0 overflow-hidden rounded-sm bg-muted">
                    <ParallaxImage
                      src={
                        [
                          "/images/guide.jpg",
                          "/images/guide-with-walkie-talkie.jpg",
                          "/images/woman-smiling-in-window--black-white.jpg",
                          "/images/photographer-omar-1.jpg",
                        ][i % 4]
                      }
                      alt={member.name}
                      fill
                      className="object-cover transition-all duration-700"
                      containerClassName="w-full h-[120%]"
                    />
                  </div>
                  <div className="absolute -bottom-8 left-0">
                    <h3 className="font-display text-4xl font-medium uppercase text-foreground">
                      {member.name}
                    </h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              <div className="w-[10vw] shrink-0" />
            </div>
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {values.map((val) => (
              <div
                key={val.title}
                className="flex flex-col border-t border-foreground pt-6 group hover:border-primary transition-colors duration-500"
              >
                <span className="font-mono text-sm text-muted-foreground mb-4">
                  ({val.order})
                </span>
                <h3 className="font-display text-3xl font-medium mb-4 uppercase group-hover:text-primary transition-colors duration-300">
                  {val.title}
                </h3>
                <p className="text-muted-foreground/80 leading-relaxed text-sm">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-10 max-w-7xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-8xl font-medium uppercase tracking-tight mb-8">
            {t("startJourney")}
          </h2>
          <a href="/contact" className="inline-block relative group">
            <span className="font-mono text-lg uppercase tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
              {tCommon("getInTouch")}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-foreground group-hover:bg-primary transition-colors duration-300 origin-left group-hover:scale-x-100" />
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
