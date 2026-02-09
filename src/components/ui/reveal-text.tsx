"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { JSX } from "react";

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  tagName?: keyof JSX.IntrinsicElements;
}

export function RevealText({
  text,
  className,
  delay = 0,
  tagName = "div",
}: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const Tag = tagName as any;

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("inline-block overflow-hidden", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="inline-block"
      >
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap mr-[0.25em]"
          >
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className="inline-block"
                variants={{
                  hidden: { y: "100%" },
                  visible: { y: 0 },
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.33, 1, 0.68, 1],
                  delay: delay + wordIndex * 0.05 + charIndex * 0.02,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
