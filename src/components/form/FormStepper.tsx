import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n'

interface FormStepperProps {
  steps: { key: string; labelKey: string }[]
  currentStep: number
  onStepClick: (index: number) => void
  className?: string
}

export function FormStepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: FormStepperProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop: Horizontal stepper */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={step.key} className="flex items-center">
              {/* Step circle and label */}
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Circle with number */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                    'border-2',
                    isActive
                      ? 'bg-foreground text-background border-foreground'
                      : isCompleted
                        ? 'bg-foreground/10 text-foreground border-foreground/30'
                        : 'bg-background text-muted-foreground border-border group-hover:border-foreground/50'
                  )}
                >
                  {index + 1}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground/70'
                  )}
                >
                  {t.stepper[step.labelKey as keyof typeof t.stepper] || step.labelKey}
                </span>
              </button>

              {/* Connector line (except for last step) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 lg:w-20 h-0.5 mx-2 transition-colors',
                    index < currentStep ? 'bg-foreground/30' : 'bg-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: Compact stepper */}
      <div className="flex md:hidden items-center justify-between px-4">
        {/* Step indicator dots */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onStepClick(index)}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                  'border-2',
                  isActive
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border'
                )}
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        {/* Current step label */}
        <span className="text-sm font-medium text-foreground">
          {t.stepper[steps[currentStep]?.labelKey as keyof typeof t.stepper] || steps[currentStep]?.labelKey}
        </span>
      </div>
    </div>
  )
}
