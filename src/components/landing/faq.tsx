"use client";

import { SectionTitle } from "./section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function FAQ() {
  const t = useTranslations("FAQ");

  const faqData = faqKeys.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));

  return (
    <section id="faq" className="py-24 md:py-32 bg-background relative">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:sticky md:top-24"
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
              className="mb-8"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-px bg-border" />
                <span className="text-sm">{t("cantFindAnswer")}</span>
              </div>
              <Link
                href="/contact"
                className="inline-block mt-4 text-primary font-medium hover:underline underline-offset-4"
              >
                {t("contactTeam")}
              </Link>
            </div>
          </motion.div>

          <div className="w-full">
            <Accordion className="w-full space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/40 last:border-0 px-0 bg-transparent transition-all duration-200"
                >
                  <AccordionTrigger className="text-left font-display text-xl uppercase font-medium py-6 hover:no-underline hover:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base font-light">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 md:hidden text-center">
              <p className="text-muted-foreground mb-4">
                {t("cantFindMobile")}
              </p>
              <Link
                href="/contact"
                className="text-primary font-medium hover:underline underline-offset-4"
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
