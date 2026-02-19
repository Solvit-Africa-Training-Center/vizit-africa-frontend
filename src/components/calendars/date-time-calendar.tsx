"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { RiTimeLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

export interface DateTimeCalendarProps {
  date?: Date
  startTime?: string
  endTime?: string
  onChange?: (val: { date: Date | undefined; startTime: string; endTime: string }) => void
  className?: string
}

export function DateTimeCalendar({
  date,
  startTime = "10:00",
  endTime = "11:00",
  onChange,
  className,
}: DateTimeCalendarProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(date)
  const [internalStartTime, setInternalStartTime] = React.useState(startTime)
  const [internalEndTime, setInternalEndTime] = React.useState(endTime)

  const handleDateSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate)
    onChange?.({ date: newDate, startTime: internalStartTime, endTime: internalEndTime })
  }

  const handleTimeChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setInternalStartTime(value)
      onChange?.({ date: internalDate, startTime: value, endTime: internalEndTime })
    } else {
      setInternalEndTime(value)
      onChange?.({ date: internalDate, startTime: internalStartTime, endTime: value })
    }
  }

  return (
    <Card className={cn("w-fit mx-auto p-0 border-border/50 shadow-sm", className)}>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleDateSelect}
          className="p-3"
          disabled={{ before: new Date() }}
          classNames={{
             day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
             day_today: "bg-accent text-accent-foreground",
          }}
        />
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-4">
        <FieldGroup className="w-full gap-4">
          <Field className="flex-1">
            <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">Start Time</FieldLabel>
            <InputGroup className="bg-background">
              <InputGroupInput
                type="time"
                value={internalStartTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className="text-sm h-9"
              />
              <InputGroupAddon className="px-2">
                <RiTimeLine className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field className="flex-1">
            <FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">End Time</FieldLabel>
            <InputGroup className="bg-background">
              <InputGroupInput
                type="time"
                value={internalEndTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className="text-sm h-9"
              />
              <InputGroupAddon className="px-2">
                <RiTimeLine className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}
