import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'

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
  const { t } = useTranslation()
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-chart-2 font-sans">{t.submission.title}</h2>
      <p className="text-muted-foreground">{t.submission.description}</p>
      <p className="text-sm text-muted-foreground">
        {t.submission.countdownPrefix}{' '}
        <span className="font-bold text-primary font-mono">{countdown}</span>{' '}
        {t.submission.countdownSuffix}
      </p>
    </div>
  )
}

interface ApplicationCardProps {
  applicationNo: string
}

function ApplicationCard({ applicationNo }: ApplicationCardProps) {
  const { t } = useTranslation()
  return (
    <div className="w-full max-w-md p-6 bg-muted/30 border-2 border-primary/20 rounded-sm space-y-3">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">{t.submission.applicationNoLabel}</p>
        <div className="p-4 bg-background rounded-sm border border-border">
          <p className="text-2xl font-mono font-bold text-primary tracking-wider">{applicationNo}</p>
        </div>
        <p className="text-sm text-muted-foreground">{t.submission.applicationNoHint}</p>
      </div>
    </div>
  )
}

function NextSteps() {
  const { t } = useTranslation()
  return (
    <div className="w-full max-w-md space-y-4 text-sm">
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-sm">
        <h3 className="font-bold text-primary mb-2 font-mono uppercase tracking-wide">{t.submission.nextStepsTitle}</h3>
        <ul className="space-y-1 text-muted-foreground">
          {t.submission.nextSteps.map((step) => (
            <li key={step}>• {step}</li>
          ))}
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
  const { t } = useTranslation()
  return (
    <div className="flex gap-4">
      <Button variant="outline" className="rounded-full" onClick={onPrint}>
        {t.submission.print}
      </Button>
      <Button className="rounded-full" onClick={onReturn}>
        {t.submission.returnHome}
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
