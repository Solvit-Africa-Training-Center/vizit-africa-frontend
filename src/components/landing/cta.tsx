"use client";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import {
  RiArrowRightLine,
  RiMailSendLine,
  RiWhatsappLine,
  RiArrowRightUpLine,
} from "@remixicon/react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CTA() {
  const t = useTranslations("CTA");

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-5 md:px-10">
        <div className="relative rounded-sm overflow-hidden bg-[#1a1a1a] text-primary-foreground isolate">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 mix-blend-overlay"
            aria-hidden="true"
          >
            <svg className="w-full h-full">
              <title>Noise overlay</title>
              <filter id="noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.60"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>

          <div className="grid lg:grid-cols-12 gap-0 min-h-[600px]">
            <div className="lg:col-span-7 p-10 md:p-16 flex flex-col relative z-20">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {t("overline")}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-primary-foreground text-6xl md:text-8xl font-medium uppercase leading-[0.85] tracking-tight mb-8"
                >
                  {t("title")} <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-white/80 font-serif italic pr-4">
                    {t("titleHighlight")}
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-primary-foreground/60 font-light max-w-md leading-relaxed mb-12"
                >
                  {t("description")}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6"
              >
                <Link href="/plan-trip" className="flex-1 sm:flex-none">
                  <Magnetic>
                    <Button className="w-full sm:w-auto h-20 px-10 rounded-sm bg-primary-foreground text-black hover:bg-primary-foreground/95 text-xl font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group">
                      <span className="flex items-center gap-2">
                        {t("startPlanning")}
                        <RiArrowRightLine className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Button>
                  </Magnetic>
                </Link>
                <Link href="/contact" className="flex-1 sm:flex-none">
                  <Magnetic>
                    <div className="w-full sm:w-auto h-20 px-8 rounded-sm border border-white/20 flex items-center justify-center gap-3 cursor-pointer hover:bg-primary-foreground/5 transition-colors duration-200 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                      <span className="text-sm font-medium uppercase tracking-wider">
                        {t("contactTeam")}
                      </span>
                      <RiArrowRightUpLine
                        className="w-5 h-5 text-primary-foreground/50 group-hover:text-primary-foreground transition-colors duration-200"
                        aria-hidden="true"
                      />
                    </div>
                  </Magnetic>
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative h-full min-h-[400px] bg-neutral-900 border-t lg:border-t-0 lg:border-l border-white/5 group overflow-hidden">
              <Image
                src="/images/tourism-guide-vehicle-car.jpg"
                alt="Safari jeep under African night sky"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-80 transition-[filter] duration-300 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/90" />
              <div className="absolute bottom-10 left-8 right-8 z-20">
                <div className="bg-primary-foreground/10 backdrop-blur-xl border border-white/10 p-1 rounded-sm shadow-2xl">
                  <div className="bg-[#0a0a0a]/80 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary-foreground/40">
                        {t("concierge")}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <a
                        href="mailto:hello@vizit.africa"
                        aria-label="Send email to hello@vizit.africa"
                        className="flex items-center gap-4 group/item cursor-pointer p-3 rounded-sm hover:bg-primary-foreground/5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <div className="w-10 h-10 rounded-sm bg-primary-foreground text-black flex items-center justify-center shrink-0">
                          <RiMailSendLine size={18} aria-hidden="true" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-xs text-primary-foreground/40 uppercase tracking-wider mb-0.5">
                            {t("emailUs")}
                          </span>
                          <span className="block text-primary-foreground font-medium truncate group-hover/item:text-accent-warm transition-colors duration-200">
                            hello@vizit.africa
                          </span>
                        </div>
                      </a>

                      <a
                        href="https://wa.me/250788123456"
                        aria-label="Contact via WhatsApp at +250 788 123 456"
                        className="flex items-center gap-4 group/item cursor-pointer p-3 rounded-sm hover:bg-primary-foreground/5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <div className="w-10 h-10 rounded-sm bg-[#25D366] text-primary-foreground flex items-center justify-center shrink-0">
                          <RiWhatsappLine size={18} aria-hidden="true" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-xs text-primary-foreground/40 uppercase tracking-wider mb-0.5">
                            {t("whatsapp")}
                          </span>
                          <span className="block text-primary-foreground font-medium truncate group-hover/item:text-green-400 transition-colors duration-200">
                            +250 788 123 456
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
