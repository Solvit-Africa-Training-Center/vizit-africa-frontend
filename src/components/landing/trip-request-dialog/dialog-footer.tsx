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
import { useTranslations } from "next-intl";

/**
 * DialogFooter — bottom action bar of TripRequestDialog.
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
  const t = useTranslations("PlanTrip.conciergeDialog.footer");

  return (
    <div className="border-t border-border/50 bg-background px-4 sm:px-7 py-4 sm:py-5 shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
        {/* Price display */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:block space-y-0.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {hasItems ? t("totalEstimate") : t("estimatedTotal")}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl sm:text-3xl font-light text-primary tracking-tight tabular-nums">
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
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            className="sm:gap-2 font-mono text-[10px] uppercase tracking-[0.12em] h-9 sm:h-10 rounded-full px-2.5 sm:px-4 shrink-0"
            render={<Link href={"/plan-trip/ai"} />}
          >
            <RiSparkling2Line className="size-4 sm:size-3.5" />
            <span className="hidden sm:inline">{t("aiAssistant")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAddons}
            disabled={!dateRange?.from || !contactInfo.departureCity}
            className="sm:gap-2 font-mono text-[10px] uppercase tracking-[0.12em] h-9 sm:h-10 rounded-full px-2.5 sm:px-4 shrink-0"
          >
            <RiAddLine className="size-4 sm:size-3.5" />
            <span className="hidden sm:inline">{t("addExtras")}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleRequestQuote}
            disabled={!canSubmit}
            className={[
              "gap-2 min-w-[110px] sm:min-w-[160px] h-9 sm:h-10 rounded-full px-4 sm:px-6 shrink-0",
              "font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em]",
              "bg-primary text-primary-foreground hover:bg-primary-light",
              "shadow-[0_4px_16px_oklch(42%_0.06_245/0.2)]",
              "transition-all duration-300",
              "disabled:opacity-40 disabled:shadow-none",
            ].join(" ")}
          >
            <span className="inline">
              {canSubmit ? t("requestQuote") : t("completeForm")}
            </span>
            <RiArrowRightLine className="size-3.5 hidden sm:inline" />
          </Button>
        </div>
      </div>
    </div>
  );
}

