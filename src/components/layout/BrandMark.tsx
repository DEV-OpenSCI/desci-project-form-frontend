import { cn } from '@/lib/utils'

type BrandSize = 'sm' | 'md' | 'lg'

type BrandDirection = 'row' | 'column'

interface BrandMarkProps {
  size?: BrandSize
  direction?: BrandDirection
  mark?: string
  title?: string
  className?: string
  markClassName?: string
  titleClassName?: string
}

const sizeStyles: Record<BrandSize, { mark: string; title: string; gap: string }> = {
  sm: {
    mark: 'w-10 h-10 text-lg',
    title: 'text-xl',
    gap: 'gap-3',
  },
  md: {
    mark: 'w-12 h-12 text-xl',
    title: 'text-2xl',
    gap: 'gap-3.5',
  },
  lg: {
    mark: 'w-16 h-16 text-3xl',
    title: 'text-4xl',
    gap: 'gap-4',
  },
}

export function BrandMark({
  size = 'sm',
  direction = 'row',
  mark = 'D',
  title = 'DeSci',
  className,
  markClassName,
  titleClassName,
}: BrandMarkProps) {
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        'inline-flex items-center',
        styles.gap,
        direction === 'column' && 'flex-col',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-mono shadow-xl',
          styles.mark,
          markClassName
        )}
      >
        {mark}
      </div>
      <span
        className={cn(
          'font-bold tracking-tight font-mono',
          styles.title,
          direction === 'column' && 'uppercase',
          titleClassName
        )}
      >
        {title}
      </span>
    </div>
  )
}
