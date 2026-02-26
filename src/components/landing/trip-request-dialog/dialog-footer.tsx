import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import {
  RiAddLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiSparkling2Line,
} from "@remixicon/react";
import type { DateRange } from "react-day-picker";
import type { ContactInfo } from "./types";

/**
 * DialogFooter — bottom action bar of TripRequestDialog.
 *
 * Design changes:
 * - Total price in Cormorant display, primary color (pricing = primary per guide)
 * - Primary action: bg-primary (brand, for main CTA on light bg)
 * - Secondary actions: outline, muted
 * - AI assistant button kept — useful feature
 */
export function DialogFooter({
  hasItems,
  totalPrice,
  nights,
  handleAddAddons,
  dateRange,
  contactInfo,
  handleRequestQuote,
  canSubmit,
}: {
  hasItems: boolean;
  totalPrice: number;
  nights: number;
  handleAddAddons: () => void;
  dateRange: DateRange | undefined;
  contactInfo: ContactInfo;
  handleRequestQuote: () => void;
  canSubmit: boolean | undefined;
}) {
  return (
    <div className="border-t border-border/50 bg-background px-7 py-5 shrink-0">
      <div className="flex items-center justify-between gap-5">
        {/* Price display */}
        <div className="space-y-0.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {hasItems ? "Total Estimate" : "Estimated Total"}
          </p>
          <div className="flex items-baseline gap-1.5">
            {/* Price in primary Cormorant — per design guide pricing rule */}
            <span className="font-display text-3xl font-light text-primary tracking-tight tabular-nums">
              ${totalPrice.toLocaleString()}
            </span>
            {nights > 0 && (
              <span className="font-mono text-[10px] text-muted-foreground/50 tracking-wide">
                / {nights} {nights === 1 ? "night" : "nights"}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="default"
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.12em] h-10 rounded-full px-4"
            render={<Link href={"/plan-trip/ai"} />}
          >
            <RiSparkling2Line className="size-3.5" />
            AI Assistant
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleAddAddons}
            disabled={!dateRange?.from || !contactInfo.departureCity}
            className="gap-2 font-mono text-[10px] uppercase tracking-[0.12em] h-10 rounded-full px-4"
          >
            <RiAddLine className="size-3.5" />
            Add Extras
          </Button>

          <Button
            size="default"
            onClick={handleRequestQuote}
            disabled={!canSubmit}
            className={[
              "gap-2 min-w-[160px] h-10 rounded-full px-6",
              "font-mono text-[10px] uppercase tracking-[0.12em]",
              "bg-primary text-primary-foreground hover:bg-primary-light",
              "shadow-[0_4px_16px_oklch(42%_0.06_245/0.2)]",
              "transition-all duration-300",
              "disabled:opacity-40 disabled:shadow-none",
            ].join(" ")}
          >
            {canSubmit ? (
              <>
                Request Quote
                <RiArrowRightLine className="size-3.5" />
              </>
            ) : (
              <>
                <RiCheckboxCircleLine className="size-3.5" />
                Complete Form
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
