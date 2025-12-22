import { Key, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccessCodeBadgeProps {
  code: string
  onChange: () => void
}

export function AccessCodeBadge({ code, onChange }: AccessCodeBadgeProps) {
  return (
    <div className="flex items-center bg-muted/40 rounded-full pl-5 pr-1 py-1 border border-border/60">
      <div className="flex items-center gap-3 mr-4">
        <div className="flex items-center gap-3">
          <Key className="h-4 w-4 text-muted-foreground/70" />
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-foreground text-sm font-normal uppercase tracking-widest">Code:</span>
            <span className="text-foreground text-sm font-normal tracking-wider">{code}</span>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        size="sm"
        onClick={onChange}
        className="h-8 rounded-full px-4 gap-2 text-xs font-bold font-mono uppercase tracking-widest transition-all hover:scale-105"
      >
        <RefreshCcw className="h-3 w-3" />
        Change
      </Button>
    </div>
  )
}
