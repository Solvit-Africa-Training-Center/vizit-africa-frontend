"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  DatePickerCalendar,
  DateRangeCalendar,
  DateTimeCalendar,
  BookingCalendar,
} from "@/components/calendars"

export default function CalendarTestPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  })
  const [dateTime, setDateTime] = React.useState<{
    date: Date | undefined
    startTime: string
    endTime: string
  }>({
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
  })

  // Mock prices for range calendar
  const today = new Date()
  const prices: Record<string, number> = {}
  for (let i = 0; i < 60; i++) {
    const d = addDays(today, i)
    prices[d.toISOString().split("T")[0]] = 100 + Math.floor(Math.random() * 50)
  }

  return (
    <div className="container mx-auto py-20 space-y-20">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. DatePickerCalendar</h2>
        <DatePickerCalendar date={date} onChange={setDate} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. DateRangeCalendar</h2>
        <DateRangeCalendar
          dateRange={range}
          onChange={setRange}
          prices={prices}
          numberOfMonths={2}
        />
      </section>

      <section className="space-y-4">
         <h2 className="text-2xl font-bold">3. DateTimeCalendar</h2>
         <DateTimeCalendar
            date={dateTime.date}
            startTime={dateTime.startTime}
            endTime={dateTime.endTime}
            onChange={setDateTime}
         />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. BookingCalendar</h2>
        <BookingCalendar
            prices={prices}
            onConfirm={(data) => console.log("Booking confirmed:", data)}
        />
      </section>
    </div>
  )
}
