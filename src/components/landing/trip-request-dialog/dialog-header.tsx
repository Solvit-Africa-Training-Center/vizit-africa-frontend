import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RiSuitcaseLine, RiUser2Line } from "@remixicon/react";

/**
 * DialogHeader — top strip of the TripRequestDialog.
 *
 * Design changes:
 * - Background: bg-surface-ink (dark, matches hero/footer aesthetic)
 * - Title: Cormorant display font, lighter weight
 * - Badges: primary-tinted for items, primary-tinted for guests/nights
 * - Amber ✦ as a decorative brand mark next to title
 */
export function DialogHeader({
  nights,
  totalGuests,
  itemsCount,
  selectedItemsDisplay,
}: {
  nights: number;
  totalGuests: number;
  itemsCount: number;
  selectedItemsDisplay: string;
}) {
  return (
    <div className="px-7 py-5 border-b border-white/[0.07] bg-surface-ink shrink-0">
      <div className="flex items-center justify-between gap-4">
        {/* Left: title + description */}
        <div className="space-y-0.5">
          <DialogTitle className="font-display text-2xl font-light text-primary-foreground tracking-tight flex items-center gap-2">
            <span className="text-primary text-base">✦</span>
            Plan Your Journey
          </DialogTitle>
          <DialogDescription className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
            Kigali, Rwanda — Concierge Request
          </DialogDescription>
        </div>

        {/* Right: status pills */}
        <div className="flex flex-col items-end gap-2 mr-6">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {nights > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-full">
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
            )}
            {totalGuests > 0 && (
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary-xl bg-primary/15 border border-primary/20 px-2.5 py-1 rounded-full">
                <RiUser2Line className="size-2.5" />
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </span>
            )}
            {itemsCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-primary-foreground bg-primary/15 border border-primary/20 px-2.5 py-1 rounded-full">
                <RiSuitcaseLine className="size-2.5" />
                {itemsCount} item{itemsCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {itemsCount > 0 && (
            <p className="font-mono text-[8px] text-white/25 text-right max-w-[240px] uppercase tracking-[0.1em] truncate">
              {selectedItemsDisplay}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
