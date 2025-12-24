import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccessCodeBadgeProps {
  code: string
  onChange: () => void
}

export function AccessCodeBadge({ onChange }: AccessCodeBadgeProps) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onChange}
      className="h-8 rounded-full px-4 gap-2 text-sm font-bold font-mono uppercase tracking-widest transition-all hover:scale-105"
    >
      <LogOut className="h-3 w-3" />
      Log out
    </Button>
  )
}
