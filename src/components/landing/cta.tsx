"use client";

import {
  RiArrowRightLine,
  RiMailSendLine,
  RiWhatsappLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/configs";

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
                className="w-full max-w-2xl bg-[#0a0a0a] rounded-sm border border-white/10 p-2 relative shadow-2xl"
              >
                {/* Flight Search Console embedded in CTA */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/20 rounded-t-sm" />
                <div className="absolute top-0 left-0 w-1/4 h-[2px] bg-primary rounded-tl-sm" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                      <span className="text-[10px] font-mono uppercase tracking-widest">
                        From
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Leaving from"
                      className="w-full h-14 pl-14 pr-4 bg-white/5 border border-transparent hover:border-white/10 focus:border-primary focus:bg-[#0a0a0a] outline-none transition-all rounded-sm text-sm font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                      <span className="text-[10px] font-mono uppercase tracking-widest">
                        To
                      </span>
                    </div>
                    <input
                      type="text"
                      value="Kigali (KGL)"
                      readOnly
                      className="w-full h-14 pl-12 pr-4 bg-white/[0.02] border border-transparent outline-none rounded-sm text-sm font-bold text-white/50"
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                      <span className="text-[10px] font-mono uppercase tracking-widest">
                        Date
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="When?"
                      className="w-full h-14 pl-14 pr-4 bg-white/5 border border-transparent hover:border-white/10 focus:border-primary focus:bg-[#0a0a0a] outline-none transition-all rounded-sm text-sm font-medium text-white placeholder:text-white/30 cursor-pointer"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-12">
                    <Link href="/plan-trip" className="block">
                      <Button className="w-full h-12 font-display uppercase tracking-widest text-xs rounded-sm transition-all hover:bg-primary/90 text-black">
                        Check-in & Book Flight
                        <RiArrowRightLine className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
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
                        href={`mailto:${siteConfig.contact.email}`}
                        aria-label={`Send email to ${siteConfig.contact.email}`}
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
                            {siteConfig.contact.email}
                          </span>
                        </div>
                      </a>

                      <a
                        href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
                        aria-label={`Contact via WhatsApp at ${siteConfig.contact.phone}`}
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
                            {siteConfig.contact.phone}
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
