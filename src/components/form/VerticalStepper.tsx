import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useTranslation } from '@/i18n'

interface VerticalStepperProps {
    steps: { key: string; labelKey: string }[]
    currentStep: number
    onStepClick: (index: number) => void
    className?: string
}

export function VerticalStepper({
    steps,
    currentStep,
    onStepClick,
    className,
}: VerticalStepperProps) {
    const { t } = useTranslation()

    return (
        <div className={cn(
            'flex flex-col gap-6 w-full p-8',
            className
        )}>
            {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                    <div key={step.key} className="relative group">
                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-[1px] -z-10 bg-border overflow-hidden">
                                <motion.div
                                    className="w-full bg-primary"
                                    initial={{ height: '0%' }}
                                    animate={{ height: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}

                        <button
                            onClick={() => onStepClick(index)}
                            className={cn(
                                'flex items-center gap-4 w-full text-left transition-all duration-300 group',
                                isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                            )}
                        >
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    'relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 z-10 bg-background',
                                    isActive
                                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110'
                                        : isCompleted
                                            ? 'border-primary bg-background text-primary'
                                            : 'border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className={cn('text-xs font-mono font-bold pt-[1px]',
                                        isActive ? 'text-primary-foreground' : 'text-inherit'
                                    )}>
                                        {index + 1}
                                    </span>
                                )}

                                {/* Active Pulse - Subtle Monochrome */}
                                {isActive && (
                                    <motion.div
                                        layoutId="stepper-pulse"
                                        className="absolute inset-0 rounded-full bg-primary/20"
                                        initial={{ scale: 1, opacity: 0.4 }}
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <div className="flex flex-col">
                                <span
                                    className={cn(
                                        'text-sm transition-all duration-300',
                                        isActive
                                            ? 'font-bold text-foreground tracking-tight'
                                            : 'font-medium text-muted-foreground group-hover:text-foreground'
                                    )}
                                >
                                    {t.stepper[step.labelKey as keyof typeof t.stepper] || step.labelKey}
                                </span>
                            </div>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
