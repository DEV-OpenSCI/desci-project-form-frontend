import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

interface StepNavigationProps {
    currentStep: number
    totalSteps: number
    onPrev: () => void
    onNext: () => void
    isSubmitting: boolean
    isValidating?: boolean
    className?: string
}

export function StepNavigation({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    isSubmitting,
    isValidating = false,
    className,
}: StepNavigationProps) {
    const { t } = useTranslation()
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === totalSteps - 1

    return (
        <div className={cn('flex items-center justify-between pt-6', className)}>
            {/* Previous button */}
            <div className="flex-1">
                {!isFirstStep && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
                        disabled={isValidating}
                        className="gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {t.stepper.prev}
                    </Button>
                )}
            </div>

            {/* Step indicator */}
            <div className="text-sm text-muted-foreground">
                {currentStep + 1} / {totalSteps}
            </div>

            {/* Next/Submit button */}
            <div className="flex-1 flex justify-end">
                {isLastStep ? (
                    <Button
                        type="submit"
                        className="px-8 rounded-full h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t.common.submitting : t.common.submit}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={isValidating}
                        className="gap-2"
                    >
                        {isValidating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t.stepper.next}
                            </>
                        ) : (
                            <>
                                {t.stepper.next}
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}
