"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export interface Calendar28Props {
  value: string
  onChange: (date: string) => void
  id?: string
  className?: string
}

export function Calendar28({ value, onChange, id, className }: Calendar28Props) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(value ? new Date(value) : undefined)
    setMonth(value ? new Date(value) : undefined)
  }, [value])

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    onChange(selectedDate.toISOString())
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full cursor-pointer">
          <Input
            id={id}
            value={date ? formatDate(date) : ""}
            placeholder="Select your birth date"
            className={cn("w-full pr-10 cursor-pointer", className)}
            readOnly
          />
          <CalendarIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-300" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0 bg-background" align="start" sideOffset={5}>
        <Calendar
          mode="single"
          selected={date}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          captionLayout="dropdown"
          required
        />
      </PopoverContent>
    </Popover>
  )
}
