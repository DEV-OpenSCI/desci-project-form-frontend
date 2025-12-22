import type { ReactNode } from 'react'

interface FillCodeLayoutProps {
  children: ReactNode
  footerText?: string
}

export function FillCodeLayout({ children, footerText = '© 2025 DeSci Foundation' }: FillCodeLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 animate-entry relative z-10">
        {children}
      </div>

      <div className="absolute bottom-8 text-sm text-muted-foreground/40 font-mono tracking-widest uppercase">
        {footerText}
      </div>
    </div>
  )
}
