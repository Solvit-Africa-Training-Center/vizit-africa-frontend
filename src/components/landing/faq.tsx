"use client";

import { faqData } from "@/lib/dummy-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FAQ() {
  const categories = [
    {
      id: "booking",
      label: "Booking & Payment",
      items: faqData.slice(0, 3),
    },
    {
      id: "services",
      label: "Services",
      items: faqData.slice(3, 5),
    },
    {
      id: "travel",
      label: "Travel Info",
      items: faqData.slice(5),
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        {/* header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Travel Questions
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Everything you need to know about planning your Rwanda trip.
          </p>
        </div>

        <Tabs
          defaultValue="booking"
          orientation="vertical"
          className="flex-col md:flex-row gap-12"
        >
          {/* Rounded, soft tab triggers */}
          <TabsList className="w-full md:w-64 shrink-0 flex-row md:flex-col h-auto bg-transparent p-0 gap-2 justify-start md:items-stretch overflow-x-auto md:overflow-visible no-scrollbar">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="group/trigger justify-start px-6 py-4 h-auto text-lg font-light text-muted-foreground data-[state=active]:bg-muted/50 data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:shadow-none transition-all duration-300 rounded-2xl"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 min-w-0 pt-6 md:pt-0">
            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0 space-y-0 animate-in fade-in-50 slide-in-from-right-4 duration-500"
              >
                <Accordion className="w-full space-y-4">
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border/40 px-6 rounded-2xl bg-card"
                    >
                      <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors text-lg font-medium py-6 text-foreground text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 font-light">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
