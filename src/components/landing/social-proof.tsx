"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { PARTNER_LOGOS as partnerLogos } from "@/lib/configs";

export function SocialProof() {
  const t = useTranslations("SocialProof");

  return (
    <section className="bg-[#0a0a0a] border-y border-white/10 overflow-hidden relative py-3">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#0a0a0a] to-transparent z-10" />

      <div className="flex items-center w-full">
        {/* Static Prefix */}
        <div className="bg-[#0a0a0a] z-20 pl-5 md:pl-10 pr-6 border-r border-white/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/50 whitespace-nowrap">
            {t("tagline") || "PARTNERED WITH"}
          </span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex gap-12 items-center whitespace-nowrap pl-12"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 40,
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
                className="flex items-center gap-4 text-white/50 hover:text-white transition-colors duration-300 cursor-pointer group"
              >
                <span className="text-sm md:text-base font-mono uppercase tracking-widest group-hover:text-shadow-sm group-hover:shadow-white/20">
                  {partner.name}
                </span>
                <span className="text-white/10">/</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
