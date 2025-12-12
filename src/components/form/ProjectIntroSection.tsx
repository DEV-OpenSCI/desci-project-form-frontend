import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Sparkles, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { useToast } from '@/components/ui/toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MILESTONE_STAGES } from '@/lib/constants'
import type { ProjectFormData } from '@/types/form'
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
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">项目介绍</CardTitle>
          <CardDescription>描述项目的科学问题、背景意义和里程碑规划</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 项目简介 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="projectSummary">
              项目简介 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">（限1500字内）</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('introduction', 'projectSummary')}
              disabled={aiParseState.introduction.parsing}
              className="gap-2"
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
              {aiParseState.introduction.error && (
                <p className="text-sm text-destructive">{aiParseState.introduction.error}</p>
              )}
              {errors.projectSummary && (
                <p className="text-sm text-destructive">{errors.projectSummary.message}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {watch('projectSummary')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* 实施的背景和意义 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="background">
              实施的背景和意义 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">（限1500字内）</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAiParse('background', 'background')}
              disabled={aiParseState.background.parsing}
              className="gap-2"
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
              {aiParseState.background.error && (
                <p className="text-sm text-destructive">{aiParseState.background.error}</p>
              )}
              {errors.background && (
                <p className="text-sm text-destructive">{errors.background.message}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {watch('background')?.length || 0}/1500
            </p>
          </div>
        </div>

        {/* 项目里程碑 */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg border-l-4 border-primary pl-3">项目里程碑</h3>
            <p className="text-sm text-muted-foreground mt-1">每个项目分为三个阶段：初期、中期、末期</p>
          </div>

          <div className="space-y-6">
            {MILESTONE_STAGES.map((stage, index) => (
              <div key={stage.value} className="p-4 border rounded-lg space-y-4 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{stage.label}阶段</span>
                </div>

                {/* 起止时间 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      开始时间 <span className="text-destructive">*</span>
                    </Label>
                    <DatePicker
                      date={watch(`milestones.${index}.startDate`)}
                      onSelect={(date) => setValue(`milestones.${index}.startDate`, date as Date)}
                      placeholder="选择开始日期"
                    />
                    {errors.milestones?.[index]?.startDate && (
                      <p className="text-sm text-destructive">
                        {errors.milestones[index]?.startDate?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>
                      结束时间 <span className="text-destructive">*</span>
                    </Label>
                    <DatePicker
                      date={watch(`milestones.${index}.endDate`)}
                      onSelect={(date) => setValue(`milestones.${index}.endDate`, date as Date)}
                      placeholder="选择结束日期"
                    />
                    {errors.milestones?.[index]?.endDate && (
                      <p className="text-sm text-destructive">
                        {errors.milestones[index]?.endDate?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 主要研究内容 */}
                <div className="space-y-2">
                  <Label>
                    主要研究内容 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder={`请简述${stage.label}阶段的研究内容`}
                    {...register(`milestones.${index}.content`)}
                  />
                  {errors.milestones?.[index]?.content && (
                    <p className="text-sm text-destructive">
                      {errors.milestones[index]?.content?.message}
                    </p>
                  )}
                </div>

                {/* 预期目标 */}
                <div className="space-y-2">
                  <Label>
                    预期目标 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="详述该阶段研究的目标，目标应该符合SMART原则（比如项目预计产生论文数/发明专利/实用新型专利/PCT），每行一个目标"
                    className="min-h-[80px]"
                    {...register(`milestones.${index}.goals`)}
                  />
                  {errors.milestones?.[index]?.goals && (
                    <p className="text-sm text-destructive">
                      {errors.milestones[index]?.goals?.message}
                    </p>
                  )}
                </div>

                {/* 隐藏的 stage 字段 */}
                <input type="hidden" {...register(`milestones.${index}.stage`)} value={stage.value} />
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
    </>
  )
}
