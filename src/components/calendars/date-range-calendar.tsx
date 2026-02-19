"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface DateRangeCalendarProps {
  dateRange?: DateRange
  onChange?: (range: DateRange | undefined) => void
  prices?: Record<string, number> // Format: "YYYY-MM-DD": price
  currency?: string
  className?: string
  numberOfMonths?: number
}

export function DateRangeCalendar({
  dateRange,
  onChange,
  prices = {},
  currency = "$",
  className,
  numberOfMonths = 2,
}: DateRangeCalendarProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(dateRange)

  // Sync internal state with prop if controlled
  React.useEffect(() => {
    if (dateRange !== undefined) {
      setRange(dateRange)
    }
  }, [dateRange])

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onChange?.(newRange)
  }

  return (
    <Card className={cn("w-fit mx-auto p-0 border-border/50 shadow-sm overflow-hidden", className)}>
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={numberOfMonths}
          captionLayout="dropdown"
          disabled={{ before: new Date() }} // Disable past dates
          className="p-3 md:p-4 [&_.rdp-months]:gap-8"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-bold",
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const dateKey = format(day.date, "yyyy-MM-dd")
              const price = prices[dateKey]
              
              const isSelected = modifiers.selected || modifiers.range_start || modifiers.range_end || modifiers.range_middle
              
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props} className={cn(props.className, "h-auto py-2")}>
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-sm font-medium">{children}</span>
                    {!modifiers.outside && !modifiers.hidden && price && (
                      <span className={cn(
                        "text-[10px] font-medium leading-none",
                        isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                      )}>
                        {currency}{price}
                      </span>
                    )}
                  </div>
                </CalendarDayButton>
              )
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
