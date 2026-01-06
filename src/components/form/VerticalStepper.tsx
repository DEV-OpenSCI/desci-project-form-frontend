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
        <div className={cn('flex flex-col gap-6 w-full max-w-[240px]', className)}>
            {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                    <div key={step.key} className="relative group">
                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                            <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-[2px] bg-border/30 overflow-hidden">
                                <motion.div
                                    className="w-full bg-blue-600"
                                    initial={{ height: '0%' }}
                                    animate={{ height: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}

                        <button
                            onClick={() => onStepClick(index)}
                            className={cn(
                                'flex items-center gap-4 w-full text-left transition-all duration-300',
                                isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                            )}
                        >
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    'relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 z-10 bg-background',
                                    isActive
                                        ? 'border-blue-600 text-blue-600 scale-110 shadow-lg shadow-blue-500/20'
                                        : isCompleted
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-muted-foreground/30 text-muted-foreground'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className={cn('text-xs font-medium',
                                        isActive ? 'text-blue-600' : 'text-muted-foreground',
                                        isCompleted && 'text-white'
                                    )}>
                                        {index + 1}
                                    </span>
                                )}

                                {/* Active Pulse */}
                                {isActive && (
                                    <motion.div
                                        layoutId="stepper-pulse"
                                        className="absolute inset-0 rounded-full bg-blue-500/30"
                                        initial={{ scale: 1, opacity: 0.2 }}
                                        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <div className="flex flex-col">
                                <span
                                    className={cn(
                                        'text-sm font-semibold tracking-wide transition-colors duration-300',
                                        isActive ? 'text-foreground' : 'text-muted-foreground'
                                    )}
                                >
                                    {t.stepper[step.labelKey as keyof typeof t.stepper] || step.labelKey}
                                </span>
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-xs text-muted-foreground/80 mt-1"
                                    >
                                        {/* Optional: Add step descriptions here if needed */}
                                    </motion.span>
                                )}
                            </div>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
