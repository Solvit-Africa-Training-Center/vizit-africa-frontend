"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "./section-title";

export function WhyUs() {
  const t = useTranslations("WhyUs");

  const stats = [
    { value: t("stats.travelers.value"), label: t("stats.travelers.label") },
    { value: t("stats.countries.value"), label: t("stats.countries.label") },
    { value: t("stats.rating.value"), label: t("stats.rating.label") },
  ];

  const benefits = t.raw("benefits") as string[];

  return (
    <section
      id="why-us"
      className="marketing-section bg-foreground text-background relative overflow-hidden isolate"
    >
      <div className="marketing-container">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              overline={t("overline")}
              title={t("title")}
              description={t("description")}
              className="mb-16"
              dark
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="border-l border-primary/20 pl-6 group hover:border-primary transition-colors duration-500"
                >
                  <div className="font-display text-2xl md:text-3xl font-medium text-primary mb-2 tabular-nums tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-background/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-4"
          >
            <ul className="space-y-8">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-6 pb-8 border-b border-white/5 last:border-0 hover:border-primary/30 transition-all duration-500"
                >
                  <span className="font-mono text-xs text-primary font-bold pt-1.5 group-hover:scale-110 transition-transform">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-light text-background/90 group-hover:text-white transition-colors text-pretty leading-relaxed">
                    {benefit}
                  </h3>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
