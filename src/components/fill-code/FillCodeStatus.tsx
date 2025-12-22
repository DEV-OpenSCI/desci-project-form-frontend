interface FillCodeStatusProps {
  demoCode: string
}

export function FillCodeStatus({ demoCode }: FillCodeStatusProps) {
  return (
    <div className="mt-8 pt-8 border-t border-border flex flex-col items-center gap-2 text-sm text-muted-foreground/60 font-mono">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
        <span>System Operational</span>
      </div>
      <p>Demo Code: {demoCode}</p>
    </div>
  )
}
