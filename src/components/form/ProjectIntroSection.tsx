import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { useToast } from '@/components/ui/toast'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'
import { parseDocument } from '@/services/aiApi'
import { useTranslation } from '@/i18n'

interface ProjectIntroSectionProps {
  form: UseFormReturn<ProjectFormData>
}

interface AiParseState {
  introduction: {
    parsing: boolean
    error?: string
  }
  background: {
    parsing: boolean
    error?: string
  }
}

export function ProjectIntroSection({ form }: ProjectIntroSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form
  const [aiParseState, setAiParseState] = useState<AiParseState>({
    introduction: { parsing: false },
    background: { parsing: false },
  })
  const { showToast, ToastContainer } = useToast()
  const { t, language } = useTranslation()

  const fieldLabels = {
    introduction: t.sections.projectIntro.projectSummary,
    background: t.sections.projectIntro.background,
  }

  const handleAiParse = async (
    fieldName: 'introduction' | 'background',
    formFieldName: 'projectSummary' | 'background'
  ) => {
    // Create a file input for AI parsing
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.txt'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      // Validate file size (max 20MB)
      const maxSize = 20 * 1024 * 1024
      if (file.size > maxSize) {
        setAiParseState(prev => ({
          ...prev,
          [fieldName]: { parsing: false, error: t.messages.fileTooLarge20 }
        }))
        showToast(t.messages.fileTooLarge20, 'error')
        return
      }

      // Start parsing
      setAiParseState(prev => ({
        ...prev,
        [fieldName]: { parsing: true, error: undefined }
      }))

      try {
        const content = await parseDocument(file, fieldName, language)
        setValue(formFieldName, content)
        setAiParseState(prev => ({
          ...prev,
          [fieldName]: { parsing: false }
        }))
        showToast(t.messages.parseSuccess.replace('{field}', fieldLabels[fieldName]), 'success')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t.messages.aiParseFailed
        setAiParseState(prev => ({
          ...prev,
          [fieldName]: {
            parsing: false,
            error: errorMessage
          }
        }))
        showToast(errorMessage, 'error')
      }
    }

    input.click()
  }

  return (
    <>
      <ToastContainer />
      <FormSection title={t.sections.projectIntro.title} description={t.sections.projectIntro.description}>
        {/* Project summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="projectSummary" required optionalHint={t.sections.projectIntro.projectSummaryHint}>
              {t.sections.projectIntro.projectSummary}
            </FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('introduction', 'projectSummary')}
              disabled={aiParseState.introduction.parsing}
              className="rounded-full pl-2 text-sm"
            >
              {aiParseState.introduction.parsing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.sections.projectIntro.aiParsing}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center rounded-full bg-gray-200 w-7 h-7 mr-2.5">
                    <span className="text-[10px] font-bold text-black">AI</span>
                  </div>
                  <span className="font-bold uppercase tracking-wide text-foreground">{t.sections.projectIntro.aiParse}</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="projectSummary"
            placeholder={t.sections.projectIntro.projectSummaryPlaceholder}
            className="min-h-[160px]"
            maxLength={1500}
            {...register('projectSummary')}
          />
          <div className="flex items-center justify-between">
            <div>
              <FieldError message={aiParseState.introduction.error} />
              <FieldError message={errors.projectSummary?.message} />
            </div>
            <p className="text-sm text-muted-foreground">
              {watch('projectSummary')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* Background and significance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="background" required optionalHint={t.sections.projectIntro.backgroundHint}>
              {t.sections.projectIntro.background}
            </FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('background', 'background')}
              disabled={aiParseState.background.parsing}
              className="rounded-full pl-2 text-sm"
            >
              {aiParseState.background.parsing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.sections.projectIntro.aiParsing}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center rounded-full bg-gray-200 w-7 h-7 mr-2.5">
                    <span className="text-[10px] font-bold text-black">AI</span>
                  </div>
                  <span className="font-bold uppercase tracking-wide text-foreground">{t.sections.projectIntro.aiParse}</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="background"
            placeholder={t.sections.projectIntro.backgroundPlaceholder}
            className="min-h-[160px]"
            maxLength={1500}
            {...register('background')}
          />
          <div className="flex items-center justify-between">
            <div>
              <FieldError message={aiParseState.background.error} />
              <FieldError message={errors.background?.message} />
            </div>
            <p className="text-sm text-muted-foreground">
              {watch('background')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* Project milestones */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg">{t.sections.projectIntro.milestones}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.sections.projectIntro.milestonesDesc}</p>
          </div>

          <div className="relative pl-8 ml-4 border-l-2 border-transparent space-y-12">
            {/* Custom Timeline Line */}
            <div className="absolute -left-[1px] top-4 bottom-0 w-px border-l-2 border-dashed border-primary/15" />

            {t.options.milestoneStages.map((stage, index) => (
              <div key={stage.value} className="relative">
                {/* Timeline Dot */}
                <span className="absolute -left-[49px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white text-base font-bold font-mono border-4 border-background z-10 ring-1 ring-blue-700/20">
                  {index + 1}
                </span>

                {/* Stage Title - Aligned with Dot */}
                <div className="h-8 flex items-center mb-4">
                  <h4 className="font-bold text-lg text-foreground">
                    {stage.label} {t.sections.projectIntro.stage}
                  </h4>
                </div>

                <div className="p-6 border border-border rounded bg-muted/5 hover:bg-muted/20 transition-colors relative group space-y-8">
                  {/* Start and end dates */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel required>{t.sections.projectIntro.startTime}</FieldLabel>
                      <DatePicker
                        date={watch(`milestones.${index}.startDate`)}
                        onSelect={(date) => setValue(`milestones.${index}.startDate`, date as Date)}
                        placeholder={t.sections.basicInfo.selectDate}
                      />
                      <FieldError message={errors.milestones?.[index]?.startDate?.message} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel required>{t.sections.projectIntro.endTime}</FieldLabel>
                      <DatePicker
                        date={watch(`milestones.${index}.endDate`)}
                        onSelect={(date) => setValue(`milestones.${index}.endDate`, date as Date)}
                        placeholder={t.sections.basicInfo.selectDate}
                      />
                      <FieldError message={errors.milestones?.[index]?.endDate?.message} />
                    </div>
                  </div>

                  {/* Main research content */}
                  <div className="space-y-2">
                    <FieldLabel required>{t.sections.projectIntro.mainContent}</FieldLabel>
                    <Input
                      placeholder={t.sections.projectIntro.mainContentPlaceholder}
                      {...register(`milestones.${index}.content`)}
                    />
                    <FieldError message={errors.milestones?.[index]?.content?.message} />
                  </div>

                  {/* Expected goals */}
                  <div className="space-y-2">
                    <FieldLabel required>{t.sections.projectIntro.expectedGoals}</FieldLabel>
                    <Textarea
                      placeholder={t.sections.projectIntro.expectedGoalsPlaceholder}
                      className="min-h-[80px]"
                      {...register(`milestones.${index}.goals`)}
                    />
                    <FieldError message={errors.milestones?.[index]?.goals?.message} />
                  </div>

                  {/* Hidden stage field */}
                  <input type="hidden" {...register(`milestones.${index}.stage`)} value={stage.value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FormSection>
    </>
  )
}
