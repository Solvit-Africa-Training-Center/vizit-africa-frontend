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
      className="py-24 md:py-32 bg-surface-dark text-white overflow-hidden"
    >
      <div className="marketing-container">
        <SectionTitle
          overline={t("overline")}
          title={
            <>
              {t("title").split(" ").slice(0, 3).join(" ")} <br />
              {t("title").split(" ").slice(3).join(" ")}
            </>
          }
          description={t("description")}
          className="mb-16 lg:mb-24 max-w-2xl"
          dark={true}
        />

        <div className="flex flex-col lg:flex-row border-y border-white/10 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {processSteps.map((step, index) => {
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex-1 p-8 lg:p-12 min-h-[320px] flex flex-col hover:bg-white/5 transition-colors duration-500"
              >
                <div className="font-display text-[80px] leading-none text-white/5 font-medium mb-auto transition-colors duration-500 group-hover:text-primary-light/20">
                  {step.step.toString().padStart(2, "0")}
                </div>

                <div className="bg-primary-light w-8 h-px mb-6 mt-12 transition-all duration-500 group-hover:w-16 shadow-[0_0_8px_rgba(var(--primary-light),0.5)]" />

                <div>
                  <h3 className="text-xl font-display font-medium text-white mb-3 transition-colors duration-300 group-hover:text-primary-light">
                    {step.title}
                  </h3>
                  <p className="font-sans text-white/60 font-light text-sm leading-relaxed text-pretty">
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
