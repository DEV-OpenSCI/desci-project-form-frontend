import { cn } from '@/lib/utils'
import logoUrl from '@/assets/Union.svg'

type BrandSize = 'sm' | 'md' | 'lg'

type BrandDirection = 'row' | 'column'

interface BrandMarkProps {
  size?: BrandSize
  direction?: BrandDirection
  // mark prop removed as we use SVG
  title?: string
  className?: string
  markClassName?: string
}

const sizeStyles: Record<BrandSize, { mark: string; gap: string }> = {
  sm: {
    mark: 'h-6 w-auto',
    gap: 'gap-0',
  },
  md: {
    mark: 'h-8 w-auto',
    gap: 'gap-0',
  },
  lg: {
    mark: 'h-10 w-auto',
    gap: 'gap-0',
  },
}

export function BrandMark({
  size = 'sm',
  direction = 'row',
  title = 'DeSci',
  className,
  markClassName,
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
      <img
        src={logoUrl}
        alt={title}
        className={cn(
          'object-contain',
          styles.mark,
          markClassName
        )}
      />
    </div>
  )
}
