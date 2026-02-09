"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/reveal-text";

interface SectionTitleProps {
  overline?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionTitle({
  overline,
  title,
  description,
  align = "left",
  className,
  dark = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center mx-auto" : "text-left",
        className,
      )}
    >
      {overline && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-warm uppercase tracking-widest text-xs font-bold block mb-3"
        >
          {overline}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={cn(
          "font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] mb-6 text-balance",
          dark ? "text-background" : "text-foreground",
        )}
      >
        {typeof title === "string" ? <RevealText text={title} /> : title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-lg font-light max-w-2xl",
            align === "center" && "mx-auto",
            dark ? "text-background/70" : "text-muted-foreground",
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
