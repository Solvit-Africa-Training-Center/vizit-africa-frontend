"use client";

import {
  RiCalendarLine,
  RiCheckDoubleLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileListLine,
  RiHotelLine,
  RiMapPinLine,
  RiPlaneLine,
  RiStickyNoteLine,
  RiTimeLine,
  RiUserLine,
  RiCarLine,
  RiSteering2Line,
  RiTranslate2,
} from "@remixicon/react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingSchema, type BaseItem } from "@/lib/unified-types";
import { cn, formatDate, formatPrice, formatTime, normalizeServiceType } from "@/lib/utils";

interface ItineraryItemProps {
  item: BaseItem;
  mode?: "view" | "edit" | "admin" | "vendor";
  onRemove?: () => void;
  onUpdate?: (updates: Partial<BaseItem>) => void;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
  defaultValues?: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    returnDate?: string;
    returnTime?: string;
  };
}

export function ItineraryItem({
  item,
  mode = "view",
  onRemove,
  onUpdate,
  onAction,
  actionLabel,
  isActionLoading,
  defaultValues,
}: ItineraryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const type = normalizeServiceType(item.type || item.itemType);

  const image = (item as any).data?.image || (item as any).data?.airlineLogo || "/images/rwanda-landscape.jpg";

  const handleUpdate = (updates: Partial<BaseItem>) => {
    if (onUpdate) {
      onUpdate(updates);
    }
  };

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

  const currentStartDate = item.startDate || defaultValues?.startDate;
  const currentEndDate = item.endDate || defaultValues?.endDate;
  const currentStartTime = item.startTime || defaultValues?.startTime;
  const currentEndTime = item.endTime || defaultValues?.endTime;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group relative flex flex-col gap-4 bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Icon/Image */}
        <div className="relative size-20 rounded-xl overflow-hidden bg-muted shrink-0 shadow-inner">
          {type === "note" ? (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <RiStickyNoteLine className="size-8" />
            </div>
          ) : (
            <Image src={image} alt={item.title} fill className="object-cover" />
          )}
          <div className="absolute top-1 left-1">
            <div className="size-6 rounded-lg bg-background/90 backdrop-blur-xs flex items-center justify-center text-primary shadow-xs">
              {type === "flight" && <RiPlaneLine className="size-3.5" />}
              {type === "hotel" && <RiHotelLine className="size-3.5" />}
              {type === "car" && <RiCarLine className="size-3.5" />}
              {type === "guide" && <RiUserLine className="size-3.5" />}
              {type === "transport" && <RiCarLine className="size-3.5" />}
              {type === "note" && <RiStickyNoteLine className="size-3.5" />}
              {type === "other" && <RiFileListLine className="size-3.5" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {type}
                  </span>
                  {item.isRoundTrip && (
                    <Badge
                      variant="outline"
                      className="h-4 py-0 text-[8px] bg-blue-50 text-blue-700 border-blue-200 uppercase"
                    >
                      Round Trip
                    </Badge>
                  )}
                  {item.withDriver && (
                    <Badge
                      variant="outline"
                      className="h-4 py-0 text-[8px] bg-orange-50 text-orange-700 border-orange-200 uppercase"
                    >
                      With Driver
                    </Badge>
                  )}
                </div>
                <h4 className="font-display text-lg font-medium leading-tight truncate">
                  {item.title}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-sm">
                  {formatPrice(Number(item.unitPrice ?? item.price ?? 0))}
                </p>
                {Number(item.quantity) > 1 && (
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">
                    Qty: {item.quantity}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 max-w-xl">
                  {item.description}
                </p>
              )}
              {type === "guide" && !!item.metadata?.language && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase mt-1">
                  <RiTranslate2 className="size-3 text-primary" />
                  Guide Language: {String(item.metadata.language)}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Summary */}
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
                Return {formatDate(item.returnDate)} {item.returnTime && `at ${formatTime(item.returnTime)}`}
              </div>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="flex flex-row sm:flex-col justify-end gap-2 sm:border-l border-border/50 sm:pl-4">
          {onUpdate && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-8 rounded-lg", isEditing && "bg-accent")}
              onClick={() => setIsEditing(!isEditing)}
            >
              <RiEditLine className="size-4" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
              onClick={onRemove}
            >
              <RiDeleteBinLine className="size-4" />
            </Button>
          )}
          {onAction && actionLabel && (
            <Button
              size="sm"
              className="h-8 text-[10px] uppercase font-bold tracking-wider"
              onClick={onAction}
              disabled={isActionLoading}
            >
              {isActionLoading ? "..." : actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Editing Panel */}
      <AnimatePresence mode="wait">
        {isEditing && onUpdate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                  {getLabel("startDate")}
                </Label>
                <Popover>
                  <PopoverTrigger render={<Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full text-xs justify-start text-left font-normal",
                      !(item.startDate || defaultValues?.startDate) && "text-muted-foreground"
                    )}
                  />}
                  >
                    <RiCalendarLine className="mr-2 size-3.5" />
                    {(item.startDate || defaultValues?.startDate) ? (
                      format(new Date(item.startDate || defaultValues!.startDate!), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={(item.startDate || defaultValues?.startDate) ? new Date(item.startDate || defaultValues!.startDate!) : undefined}
                      onSelect={(date) => 
                        handleUpdate({ startDate: date ? format(date, "yyyy-MM-dd") : undefined })
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
                    <PopoverTrigger render={<Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full text-xs justify-start text-left font-normal",
                        !(item.endDate || defaultValues?.endDate) && "text-muted-foreground"
                      )}
                    />}
                    >
                      <RiCalendarLine className="mr-2 size-3.5" />
                      {(item.endDate || defaultValues?.endDate) ? (
                        format(new Date(item.endDate || defaultValues!.endDate!), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={(item.endDate || defaultValues?.endDate) ? new Date(item.endDate || defaultValues!.endDate!) : undefined}
                        onSelect={(date) => 
                          handleUpdate({ endDate: date ? format(date, "yyyy-MM-dd") : undefined })
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
                  onChange={(e) => handleUpdate({ startTime: e.target.value })}
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
                    onChange={(e) => handleUpdate({ endTime: e.target.value })}
                  />
                </div>
              )}

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
                    onCheckedChange={(checked) =>
                      handleUpdate({ isRoundTrip: checked })
                    }
                  />
                </div>
              )}

              {type === "car" && (
                <div className="sm:col-span-2 flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <RiSteering2Line className="size-3.5 text-primary" />
                      <Label
                        htmlFor={`driver-${item.id}`}
                        className="text-xs font-bold"
                      >
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
                    onCheckedChange={(checked) =>
                      handleUpdate({ withDriver: checked })
                    }
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
                      handleUpdate({
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
                      <PopoverTrigger render={<Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full text-xs justify-start text-left font-normal border-blue-100",
                          !(item.returnDate || defaultValues?.returnDate) && "text-muted-foreground"
                        )}
                      />}
                      >
                        <RiCalendarLine className="mr-2 size-3.5 text-blue-600" />
                        {(item.returnDate || defaultValues?.returnDate) ? (
                          format(new Date(item.returnDate || defaultValues!.returnDate!), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={(item.returnDate || defaultValues?.returnDate) ? new Date(item.returnDate || defaultValues!.returnDate!) : undefined}
                          onSelect={(date) => 
                            handleUpdate({ returnDate: date ? format(date, "yyyy-MM-dd") : undefined })
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
                      onChange={(e) =>
                        handleUpdate({ returnTime: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 text-[10px] uppercase font-bold"
                onClick={() => setIsEditing(false)}
              >
                Finish Editing
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
