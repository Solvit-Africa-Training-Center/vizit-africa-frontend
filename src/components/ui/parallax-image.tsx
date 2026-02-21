"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  containerClassName?: string;
  imageClassName?: string;
  parallaxAmount?: number;
  className?: string;
}

export function ParallaxImage({
  containerClassName,
  imageClassName,
  parallaxAmount = 15,
  className,
  alt,
  ...props
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;

      gsap.fromTo(
        imageRef.current,
        {
          y: `-${parallaxAmount}%`,
          scale: 1.1,
        },
        {
          y: `${parallaxAmount}%`,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden relative h-full w-full",
        containerClassName,
        className,
      )}
    >
      <div
        ref={imageRef}
        className="w-full h-[130%] -top-[15%] absolute inset-0 will-change-transform"
      >
        <Image
          alt={alt}
          className={cn("object-cover w-full h-full", imageClassName)}
          {...props}
        />
      </div>
    </div>
  );
}
