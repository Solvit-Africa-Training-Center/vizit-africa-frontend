"use client";

import { faqData } from "@/lib/dummy-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [activeTab, setActiveTab] = useState("booking");

  const categories = [
    { id: "booking", label: "Booking & Payment", items: faqData.slice(0, 3) },
    { id: "services", label: "Services", items: faqData.slice(3, 5) },
    { id: "travel", label: "Travel Info", items: faqData.slice(5) },
  ];

  return (
    <section
      id="faq"
      className="py-24 bg-slate-50/50 border-t border-border/40"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-4 relative">
            <div className="sticky top-24">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Common Questions
              </h2>
              <p className="text-muted-foreground text-lg font-light mb-12">
                Everything you need to know about planning your unforgettable
                journey to Rwanda.
              </p>

              <nav className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "text-left px-6 py-4 rounded-none transition-all duration-300 text-lg font-medium flex items-center",
                      activeTab === cat.id
                        ? "border-l-4 border-primary bg-primary/5 text-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-8 pt-4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Accordion className="w-full space-y-4">
                {categories
                  .find((c) => c.id === activeTab)
                  ?.items.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border/20 px-6 py-4 rounded-2xl bg-white transition-all duration-300 data-[state=open]:ring-1 data-[state=open]:ring-primary/10"
                    >
                      <AccordionTrigger className="text-xl font-semibold py-2 text-foreground hover:no-underline hover:text-primary transition-colors text-left">
                        {item.question}
                      </AccordionTrigger>

                      <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4 font-light">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
