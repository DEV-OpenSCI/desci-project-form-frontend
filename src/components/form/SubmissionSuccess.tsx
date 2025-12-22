import { Button } from '@/components/ui/button'

interface SubmissionSuccessProps {
  applicationNo: string
  countdown: number
  onPrint: () => void
  onReturn: () => void
}

function SuccessIcon() {
  return (
    <div className="relative">
      <div className="w-20 h-20 bg-chart-2/20 text-chart-2 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="absolute inset-0 w-20 h-20 bg-chart-2 rounded-full animate-ping opacity-20" />
    </div>
  )
}

interface SuccessMessageProps {
  countdown: number
}

function SuccessMessage({ countdown }: SuccessMessageProps) {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-chart-2 font-sans">提交成功！</h2>
      <p className="text-muted-foreground">您的项目申请已成功提交，我们将尽快进行审核</p>
      <p className="text-sm text-muted-foreground">
        页面将在 <span className="font-bold text-primary font-mono">{countdown}</span> 秒后自动返回首页
      </p>
    </div>
  )
}

interface ApplicationCardProps {
  applicationNo: string
}

function ApplicationCard({ applicationNo }: ApplicationCardProps) {
  return (
    <div className="w-full max-w-md p-6 bg-muted/30 border-2 border-primary/20 rounded-sm space-y-3">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">申请编号</p>
        <div className="p-4 bg-background rounded-sm border border-border">
          <p className="text-2xl font-mono font-bold text-primary tracking-wider">{applicationNo}</p>
        </div>
        <p className="text-xs text-muted-foreground">请妥善保存此编号，您可以使用该编号查询申请进度</p>
      </div>
    </div>
  )
}

function NextSteps() {
  return (
    <div className="w-full max-w-md space-y-4 text-sm">
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-sm">
        <h3 className="font-bold text-primary mb-2 font-mono uppercase tracking-wide">后续流程</h3>
        <ul className="space-y-1 text-muted-foreground">
          <li>• 我们将在 3-5 个工作日内完成初审</li>
          <li>• 审核结果将通过邮件通知您</li>
          <li>• 如有疑问，请联系项目联系人</li>
        </ul>
      </div>
    </div>
  )
}

interface SuccessActionsProps {
  onPrint: () => void
  onReturn: () => void
}

function SuccessActions({ onPrint, onReturn }: SuccessActionsProps) {
  return (
    <div className="flex gap-4">
      <Button variant="outline" className="rounded-full" onClick={onPrint}>
        打印此页面
      </Button>
      <Button className="rounded-full" onClick={onReturn}>
        立即返回首页
      </Button>
    </div>
  )
}

export function SubmissionSuccess({ applicationNo, countdown, onPrint, onReturn }: SubmissionSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-16">
      <SuccessIcon />
      <SuccessMessage countdown={countdown} />
      <ApplicationCard applicationNo={applicationNo} />
      <NextSteps />
      <SuccessActions onPrint={onPrint} onReturn={onReturn} />
    </div>
  )
}
