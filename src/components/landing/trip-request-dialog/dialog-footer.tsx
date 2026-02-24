import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";
import { RiAddLine, RiArrowRightLine, RiCheckboxCircleLine, RiSparkling2Line } from "@remixicon/react";
import type { DateRange } from "react-day-picker";
import type { ContactInfo } from "./types";

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
    <div className="border-t bg-background px-8 py-6 shrink-0">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {hasItems ? "Total Estimate" : "Estimated Total"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary tabular-nums">
              ${totalPrice.toLocaleString()}
            </span>
            {nights > 0 && (
              <span className="text-sm text-muted-foreground">
                for {nights} {nights === 1 ? "night" : "nights"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            render={<Link href={"/plan-trip"} />}
          >
            <RiSparkling2Line className="size-4" />
            Use AI Assistant
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleAddAddons}
            disabled={!dateRange?.from || !contactInfo.departureCity}
            className="gap-2"
          >
            <RiAddLine className="size-4" />
            Add Extras
          </Button>
          <Button
            size="lg"
            onClick={handleRequestQuote}
            disabled={!canSubmit}
            className="gap-2 min-w-45"
          >
            {canSubmit ? (
              <>
                Request Quote
                <RiArrowRightLine className="size-4" />
              </>
            ) : (
              <>
                <RiCheckboxCircleLine className="size-4" />
                Complete Form
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
