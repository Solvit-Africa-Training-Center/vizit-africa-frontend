"use client";

import { PARTNER_LOGOS as partnerLogos } from "@/lib/configs";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function SocialProof() {
  const t = useTranslations("SocialProof");

  return (
    <section className="bg-muted/30 py-10 overflow-hidden relative">
      <div className="container max-w-7xl mx-auto px-5 mb-8 text-center">
        <p className="text-center text-sm font-normal uppercase tracking-widest text-muted-foreground/60 mb-8">
          {t("tagline")}
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-muted/30 to-transparent z-10" />

        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 60,
          }}
          aria-hidden="true"
        >
          {[
            ...partnerLogos,
            ...partnerLogos,
            ...partnerLogos,
            ...partnerLogos,
          ].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex items-center gap-4 opacity-50  hover:opacity-100 transition-[filter,opacity] duration-200 cursor-pointer"
            >
              <span className="text-xl font-medium font-display text-foreground/80">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
