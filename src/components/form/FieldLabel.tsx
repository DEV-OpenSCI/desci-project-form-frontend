import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldLabelProps {
  htmlFor?: string
  required?: boolean
  optionalHint?: string
  className?: string
  children: ReactNode
}

export function FieldLabel({
  htmlFor,
  required,
  optionalHint,
  className,
  children,
}: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={cn('flex flex-wrap items-center gap-2', className)}>
      <span>{children}</span>
      {required && <span className="text-destructive">*</span>}
      {optionalHint && <span className="text-muted-foreground text-xs">{optionalHint}</span>}
    </Label>
  )
}
