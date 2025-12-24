import { Clock } from "lucide-react"

type ExpireBadgeProps = {
  expireTime?: string
}

export function ExpireBadge({ expireTime }: ExpireBadgeProps) {
  if (!expireTime) return null

  // Parse the expireTime string (format: "YYYY-MM-DD HH:MM:SS")
  const parts = expireTime.split(' ')
  const dateParts = parts[0]?.split('-') || []
  const timeParts = parts[1]?.split(':') || []

  const year = dateParts[0] || '----'
  const month = dateParts[1] || '--'
  const day = dateParts[2] || '--'
  const hours = timeParts[0] || '--'
  const minutes = timeParts[1] || '--'
  const seconds = timeParts[2] || '--'

  return (
    <div className="relative group">
      {/* Main Container */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8 px-8 py-6 bg-card border border-border/50 shadow-lg shadow-primary/5 rounded-2xl hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm">

        {/* Left: Info & Date */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-primary/80 bg-primary/5 px-3 py-1 rounded-full w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-bold font-mono uppercase tracking-widest">Valid Until</span>
          </div>
          <div className="text-xl font-mono font-bold text-foreground/80 tracking-tight pl-1">
            {year}.{month}.{day}
          </div>
        </div>

        {/* Divider (Hidden on mobile) */}
        <div className="hidden md:block w-px h-12 bg-border/60" />

        {/* Right: Countdown Cards */}
        <div className="flex items-center gap-3">
          {/* Hours */}
          <TimeBlock value={hours} label="HOURS" />

          <Separator />

          {/* Minutes */}
          <TimeBlock value={minutes} label="MINUTES" />

          <Separator />

          {/* Seconds */}
          <TimeBlock value={seconds} label="SECONDS" highlight />
        </div>

        {/* Absolute Badge: Active Status */}
        <div className="absolute -top-3 -right-3 md:-top-3 md:-right-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 duration-1000" />
            <div className="relative flex items-center gap-1.5 bg-background shadow-sm border border-border px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimeBlock({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        relative flex items-center justify-center w-16 h-16 rounded-xl border-2 
        ${highlight
          ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
          : 'bg-muted/30 text-foreground border-border/50'
        }
      `}>
        <span className="text-3xl font-mono font-bold tracking-tighter tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col gap-1.5 pb-6 opacity-30">
      <div className="w-1 h-1 rounded-full bg-foreground" />
      <div className="w-1 h-1 rounded-full bg-foreground" />
    </div>
  )
}
