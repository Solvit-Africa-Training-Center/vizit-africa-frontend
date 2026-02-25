import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { RiCalendarLine, RiSteering2Line, RiTranslate2 } from "@remixicon/react";
import { format } from "date-fns";
import { BaseItem, ItineraryItemProps } from "./types";

export function ItemEditor({
  item,
  type,
  defaultValues,
  onUpdate,
  onClose,
  mode = "view",
}: {
  item: BaseItem;
  type: string;
  defaultValues?: ItineraryItemProps["defaultValues"];
  onUpdate: (updates: Partial<BaseItem>) => void;
  onClose: () => void;
  mode?: ItineraryItemProps["mode"];
}) {
  const getLabel = (field: "startDate" | "endDate" | "startTime" | "endTime") => {
    if (type === "hotel") {
      if (field === "startDate") return "Check-in Date";
      if (field === "endDate") return "Check-out Date";
      if (field === "startTime") return "Check-in Time";
      if (field === "endTime") return "Check-out Time";
    }
    if (type === "car" || type === "transport") {
      if (field === "startDate") return "Pickup Date";
      if (field === "endDate") return "Return Date";
      if (field === "startTime") return "Pickup Time";
      if (field === "endTime") return "Return Time";
    }
    if (type === "flight") {
      if (field === "startDate") return "Departure Date";
      if (field === "startTime") return "Departure Time";
    }
    if (field === "startDate") return "Date";
    if (field === "endDate") return "End Date";
    if (field === "startTime") return "Start Time";
    if (field === "endTime") return "End Time";
    return "";
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            {getLabel("startDate")}
          </Label>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full text-xs justify-start text-left font-normal",
                    !(item.startDate || defaultValues?.startDate) &&
                      "text-muted-foreground",
                  )}
                />
              }
            >
              <RiCalendarLine className="mr-2 size-3.5" />
              {item.startDate || defaultValues?.startDate ? (
                format(
                  new Date(item.startDate || defaultValues!.startDate!),
                  "PPP",
                )
              ) : (
                <span>Pick a date</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  item.startDate || defaultValues?.startDate
                    ? new Date(item.startDate || defaultValues!.startDate!)
                    : undefined
                }
                onSelect={(date) =>
                  onUpdate({
                    startDate: date ? format(date, "yyyy-MM-dd") : undefined,
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {type !== "flight" && type !== "guide" && (
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              {getLabel("endDate")}
            </Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full text-xs justify-start text-left font-normal",
                      !(item.endDate || defaultValues?.endDate) &&
                        "text-muted-foreground",
                    )}
                  />
                }
              >
                <RiCalendarLine className="mr-2 size-3.5" />
                {item.endDate || defaultValues?.endDate ? (
                  format(
                    new Date(item.endDate || defaultValues!.endDate!),
                    "PPP",
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    item.endDate || defaultValues?.endDate
                      ? new Date(item.endDate || defaultValues!.endDate!)
                      : undefined
                  }
                  onSelect={(date) =>
                    onUpdate({
                      endDate: date ? format(date, "yyyy-MM-dd") : undefined,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            {getLabel("startTime")}
          </Label>
          <Input
            type="time"
            className="h-9 text-xs"
            value={item.startTime || defaultValues?.startTime || ""}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
          />
        </div>

        {type !== "flight" && (
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
              {getLabel("endTime")}
            </Label>
            <Input
              type="time"
              className="h-9 text-xs"
              value={item.endTime || defaultValues?.endTime || ""}
              onChange={(e) => onUpdate({ endTime: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
            {mode === "admin" || mode === "vendor" ? "Final Price" : "Budget Hint"}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
            <Input
              type="number"
              min="0"
              step="0.01"
              className="h-9 text-xs pl-6"
              value={(item.quotePrice as number) ?? (item.price as number) ?? (item.unitPrice as number) ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : 0;
                onUpdate({ price: val, quotePrice: val, unitPrice: val });
              }}
            />
          </div>
        </div>

        {(type === "flight" || type === "car" || type === ("transport" as any)) && (
          <div className="sm:col-span-2 flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
            <div className="space-y-0.5">
              <Label
                htmlFor={`round-trip-${item.id}`}
                className="text-xs font-bold"
              >
                Round Trip / Return Leg
              </Label>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                Requires a return service on a specific date
              </p>
            </div>
            <Switch
              id={`round-trip-${item.id}`}
              checked={item.isRoundTrip || false}
              onCheckedChange={(checked) => onUpdate({ isRoundTrip: checked })}
            />
          </div>
        )}

        {type === "car" && (
          <div className="sm:col-span-2 flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <RiSteering2Line className="size-3.5 text-primary" />
                <Label htmlFor={`driver-${item.id}`} className="text-xs font-bold">
                  With Private Driver
                </Label>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
                Include a professional chauffeur for your rental
              </p>
            </div>
            <Switch
              id={`driver-${item.id}`}
              checked={item.withDriver || false}
              onCheckedChange={(checked) => onUpdate({ withDriver: checked })}
            />
          </div>
        )}

        {type === "guide" && (
          <div className="sm:col-span-2 space-y-1.5 p-3 bg-primary/5 rounded-xl border border-primary/10">
            <Label className="text-[10px] uppercase font-bold text-primary ml-1 flex items-center gap-1.5">
              <RiTranslate2 className="size-3" />
              Preferred Language
            </Label>
            <Select
              value={(item.metadata?.language as string) || "English"}
              onValueChange={(val) =>
                onUpdate({
                  metadata: { ...item.metadata, language: val },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs bg-background/50 border-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Kinyarwanda">Kinyarwanda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {item.isRoundTrip && (
          <>
            <div className="space-y-1.5 mt-2 lg:mt-0">
              <Label className="text-[10px] uppercase font-bold text-blue-600 ml-1">
                Return Date
              </Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full text-xs justify-start text-left font-normal border-blue-100",
                        !(item.returnDate || defaultValues?.returnDate) &&
                          "text-muted-foreground",
                      )}
                    />
                  }
                >
                  <RiCalendarLine className="mr-2 size-3.5 text-blue-600" />
                  {item.returnDate || defaultValues?.returnDate ? (
                    format(
                      new Date(item.returnDate || defaultValues!.returnDate!),
                      "PPP",
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      item.returnDate || defaultValues?.returnDate
                        ? new Date(item.returnDate || defaultValues!.returnDate!)
                        : undefined
                    }
                    onSelect={(date) =>
                      onUpdate({
                        returnDate: date ? format(date, "yyyy-MM-dd") : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5 mt-2 lg:mt-0">
              <Label className="text-[10px] uppercase font-bold text-blue-600 ml-1">
                Return Time
              </Label>
              <Input
                type="time"
                className="h-9 text-xs border-blue-100"
                value={item.returnTime || defaultValues?.returnTime || ""}
                onChange={(e) => onUpdate({ returnTime: e.target.value })}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <CollapsibleTrigger
          render={
            <Button
              size="sm"
              variant="secondary"
              className="h-8 text-[10px] uppercase font-bold"
              onClick={onClose}
            >
              Finish Editing
            </Button>
          }
        />
      </div>
    </>
  );
}
