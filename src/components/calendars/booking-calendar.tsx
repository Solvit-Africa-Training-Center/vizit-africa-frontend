"use client"

import * as React from "react"
import { addDays, format, differenceInDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RiTimeLine, RiUserLine, RiAddLine, RiSubtractLine, RiCalendarCheckLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

export interface BookingCalendarProps {
  className?: string
  bookedDates?: Date[]
  prices?: Record<string, number>
  currency?: string
  minNights?: number
  onConfirm?: (bookingData: BookingData) => void
}

export interface BookingData {
  dateRange: DateRange | undefined
  startTime: string
  endTime: string
  guests: {
    adults: number
    children: number
    infants: number
  }
  totalPrice?: number
}

export function BookingCalendar({
  className,
  bookedDates = [],
  prices = {},
  currency = "$",
  minNights = 1,
  onConfirm,
}: BookingCalendarProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [startTime, setStartTime] = React.useState("10:00")
  const [endTime, setEndTime] = React.useState("12:00")
  const [guests, setGuests] = React.useState({ adults: 1, children: 0, infants: 0 })

  const totalGuests = guests.adults + guests.children + guests.infants

  const handleGuestChange = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => {
      const newValue = prev[type] + delta
      if (newValue < 0) return prev
      if (type === 'adults' && newValue < 1) return prev
      return { ...prev, [type]: newValue }
    })
  }

  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    let total = 0
    let curr = dateRange.from
    while (curr < dateRange.to) {
      const dateKey = format(curr, "yyyy-MM-dd")
      total += prices[dateKey] || 100 // Default base price if not found
      curr = addDays(curr, 1)
    }
    return total * Math.max(1, guests.adults) // Simple multiplier for example
  }

  const handleConfirm = () => {
    onConfirm?.({
      dateRange,
      startTime,
      endTime,
      guests,
      totalPrice: calculateTotal()
    })
  }

  return (
    <Card className={cn("w-full max-w-4xl mx-auto shadow-sm border-border/50", className)}>
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-display uppercase tracking-tight">Select Dates & Details</CardTitle>
                <CardDescription>Choose your preferred dates, times, and guest count.</CardDescription>
            </div>
            {dateRange?.from && dateRange?.to && (
                <Badge variant="secondary" className="font-mono text-xs">
                    {differenceInDays(dateRange.to, dateRange.from)} Nights Selected
                </Badge>
            )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 lg:flex">
        {/* Left: Calendar */}
        <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-border/50">
            <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={[
                    ...bookedDates,
                    { before: new Date() }
                ]}
                min={minNights}
                className="w-full justify-center flex"
                classNames={{
                    months: "flex flex-col md:flex-row gap-8 space-y-0",
                    month: "space-y-4 w-full",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    row: "flex w-full mt-2",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-bold",
                }}
                components={{
                    DayButton: ({ children, modifiers, day, ...props }) => {
                        const dateKey = format(day.date, "yyyy-MM-dd")
                        const price = prices[dateKey]
                        const isSelected = modifiers.selected || modifiers.range_start || modifiers.range_end || modifiers.range_middle

                        return (
                            <CalendarDayButton day={day} modifiers={modifiers} {...props} className={cn(props.className, "h-auto py-2.5 w-full aspect-square")}>
                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-sm font-medium">{children}</span>
                                    {!modifiers.outside && !modifiers.hidden && price && (
                                        <span className={cn(
                                            "text-[9px] font-medium leading-none",
                                            isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                                        )}>
                                            {currency}{price}
                                        </span>
                                    )}
                                </div>
                            </CalendarDayButton>
                        )
                    }
                }}
            />
        </div>

        {/* Right: Sidebar controls */}
        <div className="w-full lg:w-80 p-6 space-y-8 bg-muted/10">
            {/* Time Selection */}
            <div className="space-y-4">
                <h4 className="text-xs font-display font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <RiTimeLine className="size-3.5" /> Time Slot
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Start</label>
                        <InputGroup className="bg-background">
                            <InputGroupInput 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)}
                                className="h-9 text-sm"
                            />
                        </InputGroup>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">End</label>
                        <InputGroup className="bg-background">
                            <InputGroupInput 
                                type="time" 
                                value={endTime} 
                                onChange={(e) => setEndTime(e.target.value)}
                                className="h-9 text-sm"
                            />
                        </InputGroup>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Guest Selection */}
            <div className="space-y-4">
                <h4 className="text-xs font-display font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <RiUserLine className="size-3.5" /> Guests
                </h4>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Adults</p>
                            <p className="text-xs text-muted-foreground">Ages 12+</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('adults', -1)} disabled={guests.adults <= 1}>
                                <RiSubtractLine className="size-3.5" />
                            </Button>
                            <span className="w-4 text-center text-sm">{guests.adults}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('adults', 1)}>
                                <RiAddLine className="size-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Children</p>
                            <p className="text-xs text-muted-foreground">Ages 2-11</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('children', -1)} disabled={guests.children <= 0}>
                                <RiSubtractLine className="size-3.5" />
                            </Button>
                            <span className="w-4 text-center text-sm">{guests.children}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('children', 1)}>
                                <RiAddLine className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Infants</p>
                            <p className="text-xs text-muted-foreground">Under 2</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('infants', -1)} disabled={guests.infants <= 0}>
                                <RiSubtractLine className="size-3.5" />
                            </Button>
                            <span className="w-4 text-center text-sm">{guests.infants}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleGuestChange('infants', 1)}>
                                <RiAddLine className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Estimate</span>
            <span className="text-2xl font-display font-medium text-primary">
                {currency}{calculateTotal().toLocaleString()}
            </span>
        </div>
        
        <Button size="lg" className="w-full sm:w-auto min-w-[150px]" onClick={handleConfirm} disabled={!dateRange?.from || !dateRange?.to}>
            <RiCalendarCheckLine className="mr-2 size-4" />
            Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
