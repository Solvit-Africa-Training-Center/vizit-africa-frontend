"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { PARTNER_LOGOS as partnerLogos } from "@/lib/configs";

/**
 * SocialProof — partner logo ticker.
 *
 * Changes from original:
 * - Pulse dot: bg-primary → bg-primary (primary = live/active signal)
 * - Background: bg-surface-muted (dark section, sits between StatsBar and Services)
 * - Separator text remains in primary (fine — it's on dark, blue works here)
 * - Fade edges respect the dark surface color
 */
export function SocialProof() {
  const t = useTranslations("SocialProof");

  return (
    <section className="bg-surface-muted border-y border-white/[0.06] overflow-hidden relative py-3">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-muted to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-muted to-transparent z-10 pointer-events-none" />

      <div className="flex items-center w-full">
        {/* Static prefix label */}
        <div
          className="bg-surface-muted z-20 border-r border-white/[0.06] flex items-center gap-2.5 shrink-0"
          style={{ paddingLeft: "var(--container-px)", paddingRight: "1.5rem" }}
        >
          {/* Amber pulse = "live" signal */}
          <span className="relative flex size-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full size-1.5 bg-primary" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40 whitespace-nowrap">
            {t("tagline") || "Partnered With"}
          </span>
        </div>

        {/* Scrolling ticker */}
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
                className="flex items-center gap-3.5 text-white/35 hover:text-white/65 transition-colors duration-300 cursor-pointer"
              >
                <span className="text-sm font-mono uppercase tracking-[0.28em]">
                  {partner.name}
                </span>
                <span className="text-white/[0.08]">/</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
