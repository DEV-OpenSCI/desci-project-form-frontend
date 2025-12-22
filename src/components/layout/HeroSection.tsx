import type { ReactNode } from "react"
import { ExpireBadge } from "./ExpireBadge"

type HeroSectionProps = {
  title: string
  description: ReactNode
  expireTime?: string
}

export function HeroSection({ title, description, expireTime }: HeroSectionProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-card rounded border border-border p-6 md:p-8 mb-8">
      {/* Left: Content */}
      <div className="flex flex-col items-start text-left max-w-2xl space-y-4">
        <h2 className="text-[28px] font-extrabold tracking-tight text-foreground">
          {title}
        </h2>

        <div className="text-base text-muted-foreground leading-relaxed font-sans text-pretty">
          {description}
        </div>
      </div>

      {/* Right: Timer Section */}
      <div className="w-full lg:w-auto flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700">
        <ExpireBadge expireTime={expireTime} />
      </div>
    </div>
  )
}
