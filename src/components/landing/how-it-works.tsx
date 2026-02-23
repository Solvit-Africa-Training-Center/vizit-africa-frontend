"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";

const stepKeys = ["1", "2", "3", "4"] as const;

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  const processSteps = stepKeys.map((key, index) => ({
    step: index + 1,
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }));

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 bg-foreground text-background overflow-hidden"
    >
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <SectionTitle
          overline={t("overline")}
          title={
            <>
              {t("title").split(" ").slice(0, 3).join(" ")} <br />
              {t("title").split(" ").slice(3).join(" ")}
            </>
          }
          description={t("description")}
          className="mb-24 max-w-3xl"
          dark
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pt-16 relative">
          {/* Connecting Flight Path Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-[28px] left-[10%] right-[20%] h-px border-t border-dashed border-white/20"
            aria-hidden="true"
          />

          {processSteps.map((step, index) => {
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Boarding Gate Number */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-background text-foreground text-xs font-mono font-bold uppercase tracking-widest py-1.5 px-3 rounded-sm relative z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    GATE {step.step.toString().padStart(2, "0")}
                  </div>
                  {/* Decorative dot on the connecting line */}
                  <div
                    className="hidden lg:block w-2.5 h-2.5 rounded-full bg-white/20 relative z-10 group-hover:bg-primary group-hover:scale-150 transition-all duration-300"
                    aria-hidden="true"
                  />
                </div>

                <div className="space-y-4 pr-4 border-l-2 border-white/10 pl-5 ml-2 group-hover:border-primary transition-colors duration-300">
                  <h3 className="text-xl font-display font-medium uppercase tracking-tight text-background group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-background/60 font-light leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
