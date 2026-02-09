"use client";

import { faqData } from "@/lib/dummy-data";
import { SectionTitle } from "./section-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

export function FAQ() {
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
              overline="Got Questions?"
              title={
                <>
                  We Have <br />
                  Answers
                </>
              }
              description="Everything you need to know about planning your unforgettable journey to Rwanda."
              className="mb-8"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-px bg-border" />
                <span className="text-sm">Can't find your answer?</span>
              </div>
              <a
                href="/contact"
                className="inline-block mt-4 text-primary font-bold hover:underline underline-offset-4"
              >
                Contact our team
              </a>
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
                  <AccordionTrigger className="text-left font-display text-xl uppercase font-bold py-6 hover:no-underline hover:text-primary transition-colors">
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
                Can't find what you're looking for?
              </p>
              <a
                href="/contact"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Contact our team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
