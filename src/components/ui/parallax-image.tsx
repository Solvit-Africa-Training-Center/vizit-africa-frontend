"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  parallaxAmount?: string;
  className?: string;
}

export function ParallaxImage({
  containerClassName,
  imageClassName,
  parallaxAmount = "15%",
  className,
  alt,
  ...props
}: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxAmount}`, parallaxAmount],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.15, 1.1]);

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden relative", containerClassName, className)}
    >
      <motion.div
        style={{ y, scale }}
        className="w-full h-full absolute inset-0"
      >
        <Image
          alt={alt}
          className={cn("object-cover w-full h-full", imageClassName)}
          {...props}
        />
      </motion.div>
    </div>
  );
}
