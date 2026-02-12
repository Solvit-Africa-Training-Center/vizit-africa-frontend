"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  RiArrowDownSLine,
  RiCheckboxCircleLine,
  RiAddCircleLine,
} from "@remixicon/react";

interface TripSectionProps {
  icon: React.ReactNode;
  title: string;
  status: "empty" | "selected" | "browsing";
  summary?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  onRemove?: () => void;
}

export function TripSection({
  icon,
  title,
  status,
  summary,
  defaultExpanded = false,
  children,
  onRemove,
}: TripSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "border rounded-sm overflow-hidden transition-colors duration-200",
        status === "selected"
          ? "border-primary/30 bg-primary/[0.02]"
          : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-primary">{icon}</span>

        <span className="font-display font-medium uppercase tracking-wider text-sm flex-1">
          {title}
        </span>

        {status === "selected" && summary && !expanded && (
          <span className="hidden md:block text-sm text-muted-foreground truncate max-w-[200px] lg:max-w-[300px]">
            {summary}
          </span>
        )}

        <span className="flex items-center gap-2">
          {status === "selected" ? (
            <span className="flex items-center gap-1 text-xs text-primary font-medium">
              <RiCheckboxCircleLine className="size-4" />
              <span className="hidden sm:inline">Added</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <RiAddCircleLine className="size-4" />
              <span className="hidden sm:inline">Optional</span>
            </span>
          )}

          <RiArrowDownSLine
            className={cn(
              "size-5 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-4 md:px-5 pb-5 pt-2 border-t border-border/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
