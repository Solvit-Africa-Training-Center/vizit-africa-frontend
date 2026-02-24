"use client";

import { cn } from "@/lib/utils";

interface TerminalDividerProps {
  className?: string;
}

export function TerminalDivider({ className }: TerminalDividerProps) {
  return (
    <div
      className={cn(
        "w-full h-10 relative flex items-center justify-between pointer-events-none opacity-20",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-foreground" />

      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute w-px h-full bg-foreground" />
        <div className="absolute w-full h-px bg-foreground" />
      </div>

      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute w-px h-full bg-foreground" />
        <div className="absolute w-full h-px bg-foreground" />
      </div>
    </div>
  );
}
