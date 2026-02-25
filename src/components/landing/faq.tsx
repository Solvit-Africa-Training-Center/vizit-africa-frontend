"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "./section-title";

const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function FAQ() {
  const t = useTranslations("FAQ");

  const faqData = faqKeys.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section
      id="faq"
      className="marketing-section bg-surface-canvas relative isolate"
    >
      <div className="marketing-container">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:sticky md:top-32"
          >
            <SectionTitle
              overline={t("overline")}
              title={
                <>
                  {t("title").split(" ").slice(0, 2).join(" ")} <br />
                  {t("title").split(" ").slice(2).join(" ")}
                </>
              }
              description={t("description")}
              className="mb-12"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-4 text-muted-foreground/60">
                <div className="w-8 h-px bg-primary/30" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                  {t("cantFindAnswer")}
                </span>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:translate-x-2 transition-all duration-300"
              >
                {t("contactTeam")}
              </Link>
            </div>
          </motion.div>

          <div className="w-full">
            <Accordion className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <AccordionTrigger className="text-left font-display text-xl md:text-2xl uppercase font-medium py-8 hover:no-underline hover:text-primary transition-all duration-300 tracking-tight leading-tight">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground/80 leading-relaxed pb-8 text-sm md:text-base font-light text-pretty">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 md:hidden">
              <p className="text-muted-foreground text-sm mb-4 italic">
                {t("cantFindMobile")}
              </p>
              <Link
                href="/contact"
                className="text-primary text-xs font-bold uppercase tracking-widest underline underline-offset-8 decoration-primary/30"
              >
                {t("contactTeam")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
