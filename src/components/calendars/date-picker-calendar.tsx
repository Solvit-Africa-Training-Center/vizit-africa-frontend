"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DatePickerCalendarProps {
  date?: Date
  onChange?: (date: Date | undefined) => void
  bookedDates?: Date[]
  disabledDates?: Date[]
  className?: string
}

export function DatePickerCalendar({
  date,
  onChange,
  bookedDates = [],
  disabledDates = [],
  className,
}: DatePickerCalendarProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date)
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    date || new Date()
  )

  // Sync internal state with prop if controlled
  React.useEffect(() => {
    if (date !== undefined) {
      setInternalDate(date)
      setCurrentMonth(date || new Date())
    }
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate)
    onChange?.(newDate)
  }

  const handlePreset = (daysToAdd: number) => {
    const newDate = addDays(new Date(), daysToAdd)
    handleSelect(newDate)
    setCurrentMonth(newDate)
  }

  return (
    <Card className={cn("w-fit mx-auto p-0 border-border/50 shadow-sm", className)}>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          disabled={[
            ...disabledDates,
            ...bookedDates,
            { before: new Date() } // Disable past dates by default for travel
          ]}
          modifiers={{
            booked: bookedDates,
          }}
          modifiersClassNames={{
            booked: "line-through opacity-50 text-muted-foreground decoration-destructive decoration-2",
          }}
          className="p-3"
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/30 p-3">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 Days", value: 3 },
          { label: "In a Week", value: 7 },
        ].map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-8 bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={() => handlePreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
