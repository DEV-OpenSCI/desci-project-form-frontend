import { format } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useTranslation } from "@/i18n"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({ date, onSelect, placeholder }: DatePickerProps) {
  const { language } = useTranslation()
  const locale = language === "en" ? enUS : zhCN
  const defaultPlaceholder = language === "en" ? "Select date" : "选择日期"
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-sans text-base text-gray-600 font-normal tracking-normal normal-case h-12 rounded border border-input bg-muted/5 px-3 transition-all hover:bg-muted/20 hover:border-input/80 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd", { locale }) : <span>{placeholder || defaultPlaceholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}
