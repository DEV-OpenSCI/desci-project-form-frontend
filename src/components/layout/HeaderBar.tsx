import { BrandMark } from "@/components/layout/BrandMark"
import { AccessCodeBadge } from "@/components/layout/AccessCodeBadge"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"

type HeaderBarProps = {
  code: string
  onChange: () => void
}

export function HeaderBar({ code, onChange }: HeaderBarProps) {
  return (
    <header className="glass-panel sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <BrandMark size="sm" />

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <AccessCodeBadge code={code} onChange={onChange} />
        </div>
      </div>
    </header>
  )
}
