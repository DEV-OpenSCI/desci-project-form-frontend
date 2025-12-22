import { BrandMark } from "@/components/layout/BrandMark"
import { AccessCodeBadge } from "@/components/layout/AccessCodeBadge"

type HeaderBarProps = {
  code: string
  onChange: () => void
}

export function HeaderBar({ code, onChange }: HeaderBarProps) {
  return (
    <header className="glass-panel sticky top-0 z-50">
      <div className="max-w-[1512px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <BrandMark size="sm" />

        <div className="flex items-center gap-4">
          <AccessCodeBadge code={code} onChange={onChange} />
        </div>
      </div>
    </header>
  )
}
