"use client";

import { cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/reveal-text";
import { motion } from "motion/react";

interface PageHeaderProps {
  title: string | React.ReactNode;
  overline?: string | React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  layout?: "vertical" | "split";
  theme?: "light" | "dark";
}

export function PageHeader({
  title,
  overline,
  description,
  children,
  className,
  align = "left",
  layout = "vertical",
  theme = "light",
}: PageHeaderProps) {
  const isDark = theme === "dark";
  const isSplit = layout === "split";

  const content = (
    <>
      {overline && (
        <div
          className={cn(
            "text-sm font-mono uppercase tracking-widest block mb-4",
            isDark ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {overline}
        </div>
      )}

      <h1
        className={cn(
          "font-display font-medium uppercase tracking-tighter leading-[0.85] mb-8",
          isDark ? "text-primary-foreground" : "text-foreground",
          "text-5xl md:text-7xl"
        )}
      >
        {typeof title === "string" ? (
          <RevealText text={title} className={cn(isDark && "text-primary-foreground")} />
        ) : (
          title
        )}
      </h1>

      {description && (
        <p
          className={cn(
            "text-xl md:text-2xl font-light leading-relaxed",
            isDark ? "text-primary-foreground/80" : "text-muted-foreground",
            align === "center" && "mx-auto",
            // If split, constrain width, otherwise generic max width
            isSplit ? "max-w-lg" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </>
  );

  return (
    <header
      className={cn(
        "px-5 md:px-10 max-w-7xl mx-auto mb-20 md:mb-32",
        align === "center" && !isSplit ? "text-center" : "text-left",
        className
      )}
    >
      {isSplit ? (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-3xl">{content}</div>
          {children && (
            <div className="flex flex-col items-start md:items-end gap-2 min-w-[200px]">
              {children}
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col",
            align === "center" && "items-center"
          )}
        >
          {content}
          {children && (
            <div className={cn("mt-8", align === "center" && "mx-auto")}>
              {children}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
