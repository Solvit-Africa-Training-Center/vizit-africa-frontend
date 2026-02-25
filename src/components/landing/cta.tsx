"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function CTA() {
  const t = useTranslations("CTA");

  return (
    <section id="contact" className="marketing-section bg-surface-cream">
      <div className="marketing-container">
        <div className="relative rounded-3xl overflow-hidden bg-surface-ink text-primary-foreground isolate border border-primary/10 shadow-2xl py-24 md:py-32 flex flex-col items-center justify-center text-center">
          {/* Radial Gradient Background (Blue tint) */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top center, oklch(65% 0.06 245 / 0.25) 0%, transparent 60%)",
            }}
          />

          {/* Grain Texture */}
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

          <div className="relative z-20 max-w-2xl px-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light shrink-0 relative">
                <span className="absolute inset-0 bg-primary-light rounded-full animate-ping opacity-50"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">
                {t("overline")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-white text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.9] tracking-tighter mb-8"
            >
              <span className="block uppercase">{t("title")}</span>
              <span className="block text-primary-light italic mt-2">
                {t("titleHighlight")}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-sans text-lg text-white/60 font-light max-w-md leading-relaxed mb-12 text-pretty"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/plan-trip" className="inline-block">
                <Button className="h-14 px-10 rounded-full bg-primary hover:bg-primary/80 text-white font-sans font-semibold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-primary/20 hover:scale-105 duration-300">
                  Plan Your Journey
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
