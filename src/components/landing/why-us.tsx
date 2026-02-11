"use client";

import { motion } from "motion/react";
import { SectionTitle } from "./section-title";
import { useTranslations } from "next-intl";

export function WhyUs() {
  const t = useTranslations("WhyUs");

  const stats = [
    { value: t("stats.travelers.value"), label: t("stats.travelers.label") },
    { value: t("stats.countries.value"), label: t("stats.countries.label") },
    { value: t("stats.rating.value"), label: t("stats.rating.label") },
  ];

  const benefits = t.raw("benefits") as string[];

  return (
    <section id="why-us" className="py-24 md:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
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
              className="mb-12"
            />

            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="border-l border-primary/20 pl-6 group hover:border-primary transition-colors duration-300"
                >
                  <div className="font-display text-6xl font-medium text-primary mb-2 tabular-nums tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
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
            <ul className="space-y-6">
              {benefits.map((benefit, i) => (
                <li
                  key={i}
                  className="group flex items-start gap-6 pb-6 border-b border-border/40 last:border-0 hover:border-primary/50 transition-colors duration-300"
                >
                  <span className="font-mono text-sm text-primary/40 pt-1.5 group-hover:text-primary transition-colors">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-light text-foreground group-hover:pl-4 transition-all duration-300">
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
