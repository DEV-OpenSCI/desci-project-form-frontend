export function FooterBar() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1512px] mx-auto px-4 md:px-16 py-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">
          DeSci Project Application Form
        </div>
        <div className="flex gap-6">
          <span className="text-sm text-muted-foreground font-mono">© 2025 OpenSCI</span>
        </div>
      </div>
    </footer>
  )
}
