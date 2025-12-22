import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Sparkles, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { useToast } from '@/components/ui/toast'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'
import { MILESTONE_STAGES } from '@/lib/constants'
import { parseDocument } from '@/services/aiApi'

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

  const fieldLabels = {
    introduction: '项目简介',
    background: '背景和意义',
  }

  const handleAiParse = async (
    fieldName: 'introduction' | 'background',
    formFieldName: 'projectSummary' | 'background'
  ) => {
    // 创建文件选择器
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx,.txt'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      // 验证文件大小（最大 20MB）
      const maxSize = 20 * 1024 * 1024
      if (file.size > maxSize) {
        setAiParseState(prev => ({
          ...prev,
          [fieldName]: { parsing: false, error: '文件大小不能超过 20MB' }
        }))
        showToast('文件大小不能超过 20MB', 'error')
        return
      }

      // 开始解析
      setAiParseState(prev => ({
        ...prev,
        [fieldName]: { parsing: true, error: undefined }
      }))

      try {
        const content = await parseDocument(file, fieldName)
        setValue(formFieldName, content)
        setAiParseState(prev => ({
          ...prev,
          [fieldName]: { parsing: false }
        }))
        showToast(`${fieldLabels[fieldName]}解析成功`, 'success')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'AI 解析失败，请重试'
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
      <FormSection title="项目介绍" description="描述项目的科学问题、背景意义和里程碑规划">
        {/* 项目简介 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="projectSummary" required optionalHint="（限1500字内）">
              项目简介
            </FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('introduction', 'projectSummary')}
              disabled={aiParseState.introduction.parsing}
              className="gap-2 rounded-full"
            >
              {aiParseState.introduction.parsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI 解析中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI 解析文档
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="projectSummary"
            placeholder="介绍目前存在的科学问题，可以通过什么手段解决此问题"
            className="min-h-[160px]"
            maxLength={1500}
            {...register('projectSummary')}
          />
          <div className="flex items-center justify-between">
            <div>
              <FieldError message={aiParseState.introduction.error} />
              <FieldError message={errors.projectSummary?.message} />
            </div>
            <p className="text-xs text-muted-foreground">
              {watch('projectSummary')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* 实施的背景和意义 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="background" required optionalHint="（限1500字内）">
              实施的背景和意义
            </FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('background', 'background')}
              disabled={aiParseState.background.parsing}
              className="gap-2 rounded-full"
            >
              {aiParseState.background.parsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI 解析中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI 解析文档
                </>
              )}
            </Button>
          </div>
          <Textarea
            id="background"
            placeholder="概述项目所面向的经济、社会和科技发展等有效需求，项目的先进性、重要性、必要性、可行性以及在行业发展中的地位和作用；预期实现的经济和社会效益等方面"
            className="min-h-[160px]"
            maxLength={1500}
            {...register('background')}
          />
          <div className="flex items-center justify-between">
            <div>
              <FieldError message={aiParseState.background.error} />
              <FieldError message={errors.background?.message} />
            </div>
            <p className="text-xs text-muted-foreground">
              {watch('background')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* 项目里程碑 */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg">项目里程碑</h3>
            <p className="text-sm text-muted-foreground mt-1">每个项目分为三个阶段：初期、中期、末期</p>
          </div>

          <div className="relative pl-8 ml-4 border-l-2 border-transparent space-y-12">
            {/* Custom Timeline Line */}
            <div className="absolute -left-[1px] top-4 bottom-0 w-px border-l-2 border-dashed border-primary/15" />

            {MILESTONE_STAGES.map((stage, index) => (
              <div key={stage.value} className="relative">
                {/* Timeline Dot */}
                <span className="absolute -left-[49px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white text-base font-bold font-mono border-4 border-background z-10 ring-1 ring-blue-700/20">
                  {index + 1}
                </span>

                {/* Stage Title - Aligned with Dot */}
                <div className="h-8 flex items-center mb-4">
                  <h4 className="font-bold text-lg text-foreground">{stage.label}阶段</h4>
                </div>

                <div className="p-6 border border-border rounded bg-muted/5 hover:bg-muted/20 transition-colors relative group space-y-8">
                  {/* 起止时间 */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel required>开始时间</FieldLabel>
                      <DatePicker
                        date={watch(`milestones.${index}.startDate`)}
                        onSelect={(date) => setValue(`milestones.${index}.startDate`, date as Date)}
                        placeholder="选择开始日期"
                      />
                      <FieldError message={errors.milestones?.[index]?.startDate?.message} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel required>结束时间</FieldLabel>
                      <DatePicker
                        date={watch(`milestones.${index}.endDate`)}
                        onSelect={(date) => setValue(`milestones.${index}.endDate`, date as Date)}
                        placeholder="选择结束日期"
                      />
                      <FieldError message={errors.milestones?.[index]?.endDate?.message} />
                    </div>
                  </div>

                  {/* 主要研究内容 */}
                  <div className="space-y-2">
                    <FieldLabel required>主要研究内容</FieldLabel>
                    <Input
                      placeholder={`请简述${stage.label}阶段的研究内容`}
                      {...register(`milestones.${index}.content`)}
                    />
                    <FieldError message={errors.milestones?.[index]?.content?.message} />
                  </div>

                  {/* 预期目标 */}
                  <div className="space-y-2">
                    <FieldLabel required>预期目标</FieldLabel>
                    <Textarea
                      placeholder="详述该阶段研究的目标，目标应该符合SMART原则（比如项目预计产生论文数/发明专利/实用新型专利/PCT），每行一个目标"
                      className="min-h-[80px]"
                      {...register(`milestones.${index}.goals`)}
                    />
                    <FieldError message={errors.milestones?.[index]?.goals?.message} />
                  </div>

                  {/* 隐藏的 stage 字段 */}
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
