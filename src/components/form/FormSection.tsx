import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
  headerClassName,
  bodyClassName,
}: FormSectionProps) {
  return (
    <section className={cn('bg-card rounded border border-border p-6 md:p-8 space-y-8', className)}>
      <div className={cn('space-y-2 border-b border-border/40 pb-4', headerClassName)}>
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      <div className={cn('space-y-8', bodyClassName)}>{children}</div>
    </section>
  )
}
