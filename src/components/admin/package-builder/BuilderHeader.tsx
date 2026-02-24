"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/utils/quote-calculator";

interface BuilderHeaderProps {
  requestName: string;
  total: number;
  isSending: boolean;
  itemCount: number;
  onClearDraft: () => void;
  onSendQuote: () => void;
}

export function BuilderHeader({
  requestName,
  total,
  isSending,
  itemCount,
  onClearDraft,
  onSendQuote,
}: BuilderHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 pb-4 pt-4 mb-6 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <RiArrowLeftLine className="size-4" />
            Back to Bookings
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            Package Builder
            <span className="text-muted-foreground font-normal text-lg ml-2">
              {requestName}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Quote Value
            </p>
            <p className="font-mono text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClearDraft}
              title="Clear all draft items"
            >
              Clear Draft
            </Button>
            <Button
              disabled={isSending || itemCount === 0}
              size="lg"
              onClick={onSendQuote}
            >
              {isSending ? "Sending..." : "Send Quote"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
