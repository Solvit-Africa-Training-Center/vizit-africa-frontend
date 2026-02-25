"use client";

import {
  RiArrowRightLine,
  RiMailSendLine,
  RiWhatsappLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/configs";

export function CTA() {
  const t = useTranslations("CTA");
  const [departureCity, setDepartureCity] = useState("");

  return (
    <section id="contact" className="marketing-section bg-background">
      <div className="marketing-container">
        <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] text-primary-foreground isolate border border-white/5 shadow-card">
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
            <div className="lg:col-span-7 p-8 md:p-16 flex flex-col relative z-20">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-10"
                >
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40 font-bold">
                    {t("overline")}
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-primary-foreground text-5xl md:text-7xl font-medium uppercase leading-[0.9] tracking-tighter mb-8"
                >
                  {t("title")} <br />
                  <span className="text-primary font-display pr-4">
                    {t("titleHighlight")}
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-white/60 font-light max-w-sm leading-relaxed mb-12 text-pretty"
                >
                  {t("description")}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-white/10 p-2 relative shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                        From
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Origin city"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      className="w-full h-14 pl-14 pr-4 bg-white/[0.03] border border-transparent hover:border-white/10 focus:border-primary/50 focus:bg-[#0a0a0a] outline-none transition-all rounded-xl text-sm font-medium text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                        To
                      </span>
                    </div>
                    <input
                      type="text"
                      value="Kigali (KGL)"
                      readOnly
                      className="w-full h-14 pl-12 pr-4 bg-white/[0.01] border border-transparent outline-none rounded-xl text-sm font-bold text-white/40"
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                        Date
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Arrival"
                      className="w-full h-14 pl-14 pr-4 bg-white/[0.03] border border-transparent hover:border-white/10 focus:border-primary/50 focus:bg-[#0a0a0a] outline-none transition-all rounded-xl text-sm font-medium text-white placeholder:text-white/20 cursor-pointer"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-12">
                    <Link 
                      href={`/plan-trip?departure=${encodeURIComponent(departureCity)}&source=widget`} 
                      className="block"
                    >
                      <Button className="w-full h-14 font-display uppercase tracking-[0.2em] text-[10px] font-bold rounded-xl transition-all hover:scale-[1.01] bg-primary text-primary-foreground border-none">
                        Check-in & Sourcing
                        <RiArrowRightLine className="size-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative h-full min-h-[400px] bg-neutral-900 border-t lg:border-t-0 lg:border-l border-white/5 group overflow-hidden">
              <Image
                src="/images/tourism-guide-vehicle-car.jpg"
                alt="Concierge Sourcing"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/95" />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-2xl shadow-2xl">
                  <div className="bg-[#0a0a0a]/60 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-bold">
                        {t("concierge")}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="flex items-center gap-4 group/item cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                          <RiMailSendLine size={18} />
                        </div>
                        <div className="overflow-hidden text-left">
                          <span className="block text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">
                            {t("emailUs")}
                          </span>
                          <span className="block text-white font-medium truncate group-hover/item:text-primary transition-colors text-sm">
                            {siteConfig.contact.email}
                          </span>
                        </div>
                      </a>

                      <a
                        href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
                        className="flex items-center gap-4 group/item cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="size-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                          <RiWhatsappLine size={18} />
                        </div>
                        <div className="overflow-hidden text-left">
                          <span className="block text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">
                            {t("whatsapp")}
                          </span>
                          <span className="block text-white font-medium truncate group-hover/item:text-green-400 transition-colors text-sm">
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
