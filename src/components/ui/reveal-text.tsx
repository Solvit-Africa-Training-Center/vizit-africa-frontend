"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { JSX } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

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
  const ref = useRef<HTMLDivElement>(null);
  const Tag = tagName as any;

  const words = text.split(" ");

  useGSAP(
    () => {
      const chars = ref.current?.querySelectorAll(".reveal-char");
      if (!chars) return;

      gsap.fromTo(
        chars,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.02,
          delay: delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={cn("inline-block overflow-hidden leading-tight", className)}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden align-top"
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className="reveal-char inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
