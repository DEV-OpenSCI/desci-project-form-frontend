import type { ReactNode } from 'react'

interface FillCodePanelProps {
  children: ReactNode
}

export function FillCodePanel({ children }: FillCodePanelProps) {
  return (
    <div className="glass-panel-solid p-8 md:p-10 rounded-xl border border-border/60 backdrop-blur-xl">
      {children}
    </div>
  )
}
