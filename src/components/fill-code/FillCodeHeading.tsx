import type { ReactNode } from 'react'
import { BrandMark } from '@/components/layout/BrandMark'

interface FillCodeHeadingProps {
  title?: string
  description: ReactNode
}

export function FillCodeHeading({ title = 'DeSci', description }: FillCodeHeadingProps) {
  return (
    <div className="space-y-2 text-center">
      <BrandMark
        size="lg"
        direction="column"
        title={title}
        titleClassName="uppercase"
      />
      <p className="text-muted-foreground font-sans text-lg">{description}</p>
    </div>
  )
}
