import React from "react"

import { FooterBar } from "./FooterBar"

type PageLayoutProps = {
  header: React.ReactNode
  hero: React.ReactNode
  children: React.ReactNode
}

export function PageLayout({ header, hero, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-transparent text-foreground transition-colors duration-300 font-sans selection:bg-primary/20 relative z-10">
      {header}

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 animate-entry">
        {hero}

        <div className="pt-0">
          {children}
        </div>
      </main>

      <FooterBar />
    </div>
  )
}
