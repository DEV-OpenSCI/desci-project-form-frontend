import type { ReactNode } from "react"
import { useTranslation } from "@/i18n"

type HeroSectionProps = {
  title?: string
  description?: ReactNode
}

export function HeroSection({ title, description }: HeroSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-start gap-4 mb-8">
      <div className="flex flex-col items-start text-left max-w-3xl space-y-4">
        <h2 className="text-[28px] font-extrabold tracking-tight text-foreground">
          {title || t.hero.title}
        </h2>

        <div className="text-base text-muted-foreground leading-relaxed font-sans text-pretty">
          {description || (
            <>
              {t.hero.description}{' '}
              <span className="text-destructive font-bold">{t.hero.requiredMark}</span> {t.hero.requiredText}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
