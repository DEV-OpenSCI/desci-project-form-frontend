import { FillCodeProvider, useFillCode } from '@/contexts/FillCodeContext'
import { FillCodeForm } from '@/components/FillCodeForm'
import { ProjectForm } from '@/components/form/ProjectForm'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

// 脱敏显示填写码（显示前4位...后4位）
function maskFillCode(code: string): string {
  if (code.length <= 8) return code
  return `${code.slice(0, 4)}...${code.slice(-4)}`
}

function AppContent() {
  const { fillCode, expireTime, clear } = useFillCode()

  // 如果没有填写码，显示填写码输入页面
  if (!fillCode) {
    return <FillCodeForm />
  }

  // 有填写码，显示项目申请表单
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">DeSci</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="text-muted-foreground">
                填写码: <span className="font-mono text-foreground">{maskFillCode(fillCode)}</span>
              </div>
              {expireTime && (
                <div className="text-xs text-muted-foreground">
                  有效期至: {expireTime}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              更换填写码
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            项目申请表
          </h2>
          <p className="text-muted-foreground">
            请填写以下信息完成项目申请，带{' '}
            <span className="text-destructive">*</span> 的为必填项
          </p>
        </div>

        {/* Form */}
        <ProjectForm />
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          DeSci Project Application Form
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <FillCodeProvider>
      <AppContent />
    </FillCodeProvider>
  )
}

export default App
