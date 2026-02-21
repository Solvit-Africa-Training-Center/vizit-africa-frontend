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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-t border-white/10 pt-12">
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
                <div
                  className="font-display text-8xl md:text-9xl font-medium text-primary-foreground/20 mb-6 leading-none select-none transition-colors duration-500 group-hover:text-primary"
                  aria-hidden="true"
                >
                  {step.step.toString().padStart(2, "0")}
                </div>

                <div className="space-y-4 pr-4">
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
