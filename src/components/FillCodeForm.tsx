import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FillCodeLayout } from '@/components/fill-code/FillCodeLayout'
import { FillCodeHeading } from '@/components/fill-code/FillCodeHeading'
import { FillCodePanel } from '@/components/fill-code/FillCodePanel'
import { FillCodeStatus } from '@/components/fill-code/FillCodeStatus'

import { useFillCode } from '@/contexts/FillCodeContext'

export function FillCodeForm() {
  const [code, setCode] = useState('')
  const { validateAndSet, isValidating, error } = useFillCode()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    await validateAndSet(code.trim())
  }

  return (
    <FillCodeLayout>
      <FillCodeHeading description="Enter your access code to begin." />

      <FillCodePanel>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="fillCode" className="text-sm font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Access Code
            </Label>
            <Input
              id="fillCode"
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isValidating}
              className="font-mono text-center uppercase"
              maxLength={14}
              autoFocus
            />
            {error && (
              <div className="flex items-center justify-center gap-2 text-destructive animate-in slide-in-from-top-1">
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            disabled={isValidating || !code.trim()}
          >
            {isValidating ? 'Verifying...' : 'Enter Application'}
          </Button>
        </form>

        <FillCodeStatus demoCode="TEST_CODE_20251212" />
      </FillCodePanel>
    </FillCodeLayout>
  )
}
