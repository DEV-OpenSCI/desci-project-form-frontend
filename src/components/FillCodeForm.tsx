import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">DeSci 项目申请</h1>
          <p className="text-muted-foreground">请输入您的填写码以继续</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fillCode">填写码</Label>
            <Input
              id="fillCode"
              type="text"
              placeholder="请输入填写码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isValidating}
              className="font-mono"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isValidating || !code.trim()}
          >
            {isValidating ? '验证中...' : '验证并继续'}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>测试填写码: TEST_CODE_20251212</p>
          <p>有效期至: 2025-12-19</p>
        </div>
      </Card>
    </div>
  )
}
