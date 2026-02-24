import { RiCalendarLine, RiCheckDoubleLine, RiTimeLine } from "@remixicon/react";
import { formatDate, formatTime } from "@/lib/utils";
import { BaseItem, ItineraryItemProps } from "./types";

export function ItemSummary({
  item,
  type,
  defaultValues,
}: {
  item: BaseItem;
  type: string;
  defaultValues?: ItineraryItemProps["defaultValues"];
}) {
  const currentStartDate = item.startDate || defaultValues?.startDate;
  const currentEndDate = item.endDate || defaultValues?.endDate;
  const currentStartTime = item.startTime || defaultValues?.startTime;
  const currentEndTime = item.endTime || defaultValues?.endTime;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 pt-3 border-t border-border/30">
      {currentStartDate && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/80">
          <RiCalendarLine className="size-3.5 text-primary" />
          {formatDate(currentStartDate)}
          {currentEndDate && type !== "flight" && ` — ${formatDate(currentEndDate)}`}
        </div>
      )}
      {(currentStartTime || currentEndTime) && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <RiTimeLine className="size-3.5" />
          {formatTime(currentStartTime)}
          {currentEndTime && type !== "flight" && ` — ${formatTime(currentEndTime)}`}
        </div>
      )}
      {item.isRoundTrip && item.returnDate && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded">
          <RiCheckDoubleLine className="size-3.5" />
          Return {formatDate(item.returnDate)}{" "}
          {item.returnTime && `at ${formatTime(item.returnTime)}`}
        </div>
      )}
    </div>
  );
}
