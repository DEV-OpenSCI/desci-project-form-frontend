import { useState, useEffect, useCallback } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'

import { useToast } from '@/components/ui/toast'
import { BasicInfoSection } from './BasicInfoSection'
import { TeamSection } from './TeamSection'
import { ProjectIntroSection } from './ProjectIntroSection'
import { BudgetSection } from './BudgetSection'
import { ContactSection } from './ContactSection'
import { SubmissionSuccess } from '@/components/form/SubmissionSuccess'
import { createProjectFormSchema, type ProjectFormData } from '@/types/form'
import { submitApplication } from '@/services/formApi'
import { useFillCode } from '@/contexts/FillCodeContext'
import { useTranslation } from '@/i18n'

// 测试用 mock 数据
function getMockFormData(): ProjectFormData {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear() + 2, now.getMonth(), 0)

  // 里程碑时间分配（每阶段约8个月）
  const phase1Start = new Date(startDate)
  const phase1End = new Date(startDate.getFullYear(), startDate.getMonth() + 8, 0)
  const phase2Start = new Date(phase1End.getFullYear(), phase1End.getMonth() + 1, 1)
  const phase2End = new Date(phase2Start.getFullYear(), phase2Start.getMonth() + 8, 0)
  const phase3Start = new Date(phase2End.getFullYear(), phase2End.getMonth() + 1, 1)
  const phase3End = new Date(endDate)

  return {
    projectName: 'Decentralized Research Data Sharing Platform',
    startDate,
    endDate,
    discipline: 'engineering',
    field: 'materials',
    teamSize: 5,
    leader: {
      name: 'Alex Chen',
      orcid: '0000-0002-1234-5678',
      email: 'alex.chen@example.edu.cn',
      title: 'professor',
      education: 'phd',
      bio: 'Focused on distributed systems and blockchain research, with multiple publications and project leadership.',
    },
    members: [
      { role: 'key-member', resumeS3Key: '' },
      { role: 'other-member', resumeS3Key: '' },
    ],
    projectSummary: 'Research data sharing faces challenges such as lack of trust, weak incentives, and privacy risks. This project proposes a decentralized platform with smart contracts for data ownership, access control, and contribution incentives.',
    background: 'Research data is increasingly strategic, yet centralized sharing models suffer from silos and weak data protection. Decentralized systems can improve transparency, traceability, and collaboration efficiency.',
    milestones: [
      {
        stage: 'early',
        startDate: phase1Start,
        endDate: phase1End,
        content: 'Finalize system architecture and core module development',
        goals: 'Complete requirements analysis and system design\nSelect and integrate a blockchain framework\nDevelop data ownership smart contracts',
      },
      {
        stage: 'mid',
        startDate: phase2Start,
        endDate: phase2End,
        content: 'Deliver main platform features and testing',
        goals: 'Implement data sharing and access control modules\nDeliver contribution incentive mechanism\nSubmit 2 conference papers',
      },
      {
        stage: 'late',
        startDate: phase3Start,
        endDate: phase3End,
        content: 'Complete integration testing and pilot deployment',
        goals: 'Optimize performance and conduct security audit\nRun pilots across 3+ research institutions\nFile 2 patent applications',
      },
    ],
    budgetItems: [
      { category: 'equipment', donationAmount: 50000, selfFundedAmount: 20000 },
      { category: 'materials', donationAmount: 30000, selfFundedAmount: 10000 },
      { category: 'testing', donationAmount: 20000, selfFundedAmount: 5000 },
      { category: 'travel', donationAmount: 15000, selfFundedAmount: 5000 },
      { category: 'conference', donationAmount: 10000, selfFundedAmount: 5000 },
      { category: 'publication', donationAmount: 8000, selfFundedAmount: 2000 },
      { category: 'labor', donationAmount: 60000, selfFundedAmount: 20000 },
    ],
    contact: {
      name: 'Jamie Lee',
      email: 'jamie.lee@example.edu.cn',
      phone: '13800138000',
    },
  }
}

const REDIRECT_COUNTDOWN = 10 // 倒计时秒数

// 获取第一个错误字段的名称（支持嵌套）
function getFirstErrorFieldName(errors: FieldErrors<ProjectFormData>): string | null {
  const fieldOrder = [
    'projectName', 'startDate', 'endDate', 'discipline', 'field', 'teamSize',
    'leader.name', 'leader.email', 'leader.title', 'leader.education',
    'members',
    'projectSummary', 'background',
    'milestones',
    'budgetItems',
    'contact.name', 'contact.email', 'contact.phone',
  ]

  for (const field of fieldOrder) {
    const parts = field.split('.')
    let error: unknown = errors
    for (const part of parts) {
      error = (error as Record<string, unknown>)?.[part]
    }
    if (error) {
      return field
    }
  }

  // 检查数组字段
  if (errors.milestones) {
    for (let i = 0; i < 3; i++) {
      const milestoneErrors = errors.milestones[i]
      if (milestoneErrors) {
        const fields = ['startDate', 'endDate', 'content', 'goals']
        for (const f of fields) {
          if ((milestoneErrors as Record<string, unknown>)[f]) {
            return `milestones.${i}.${f}`
          }
        }
      }
    }
  }

  return null
}

// 滚动到错误字段
function scrollToErrorField(fieldName: string) {
  // 尝试通过 name 属性查找
  let element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement

  // 如果找不到，尝试通过 id 查找（某些组件如 Select 可能使用 id）
  if (!element) {
    const idFieldName = fieldName.replace(/\./g, '-')
    element = document.getElementById(idFieldName) as HTMLElement
  }

  // 如果还是找不到，尝试查找相关的 label
  if (!element) {
    const labels = document.querySelectorAll('label')
    for (const label of labels) {
      if (label.htmlFor?.includes(fieldName.split('.').pop() || '')) {
        element = label as HTMLElement
        break
      }
    }
  }

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // 尝试聚焦
    setTimeout(() => {
      if (element && 'focus' in element) {
        (element as HTMLInputElement).focus?.()
      }
    }, 500)
  }
}

export function ProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [applicationNo, setApplicationNo] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN)
  const { clear: clearFillCode } = useFillCode()
  const { showToast, ToastContainer } = useToast()
  const { t } = useTranslation()

  // 检测是否为测试模式
  const isTestMode = new URLSearchParams(window.location.search).get('test') === 'true'

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectFormSchema(t)),
    defaultValues: {
      projectName: '',
      discipline: '',
      field: '',
      teamSize: 1,
      leader: {
        name: '',
        orcid: '',
        email: '',
        title: '',
        education: '',
        bio: '',
      },
      members: [],
      projectSummary: '',
      background: '',
      milestones: t.options.milestoneStages.map((stage) => ({
        stage: stage.value,
        startDate: undefined as unknown as Date,
        endDate: undefined as unknown as Date,
        content: '',
        goals: '',
      })),
      budgetItems: [],
      contact: {
        name: '',
        email: '',
        phone: '',
      },
    },
  })

  // 测试模式下自动填充 mock 数据
  useEffect(() => {
    if (isTestMode) {
      const mockData = getMockFormData()
      form.reset(mockData)
    }
  }, [isTestMode, form])

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const appNo = await submitApplication(data)
      setApplicationNo(appNo)
      setCountdown(REDIRECT_COUNTDOWN) // 重置倒计时
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : t.messages.submitFailed
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // 表单校验失败时的处理
  const onInvalid = useCallback((errors: FieldErrors<ProjectFormData>) => {
    // 计算错误数量
    let errorCount = 0
    const countErrors = (obj: unknown): number => {
      if (!obj || typeof obj !== 'object') return 0
      let count = 0
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object' && 'message' in value) {
          count++
        } else if (Array.isArray(value)) {
          for (const item of value) {
            count += countErrors(item)
          }
        } else if (typeof value === 'object') {
          count += countErrors(value)
        }
      }
      return count
    }
    errorCount = countErrors(errors)

    // 显示 toast 提示
    showToast(
      t.messages.formMissingRequired.replace('{count}', `${errorCount}`),
      'warning'
    )

    // 滚动到第一个错误字段
    const firstErrorField = getFirstErrorFieldName(errors)
    if (firstErrorField) {
      setTimeout(() => scrollToErrorField(firstErrorField), 100)
    }
  }, [showToast, t])

  // 提交成功后的倒计时逻辑
  useEffect(() => {
    if (!applicationNo) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          clearFillCode() // 倒计时结束后清除填写码，返回首页
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [applicationNo, clearFillCode])

  // 如果提交成功，显示成功页面
  if (applicationNo) {
    return (
      <SubmissionSuccess
        applicationNo={applicationNo}
        countdown={countdown}
        onPrint={() => window.print()}
        onReturn={clearFillCode}
      />
    )
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        {/* 第一部分：项目基本信息 */}
        {/* 第一部分：项目基本信息 */}
        <BasicInfoSection form={form} />

        {/* 第二部分：项目组成员信息 */}
        <TeamSection form={form} />

        {/* 第三部分：项目介绍 */}
        <ProjectIntroSection form={form} />

        {/* 第四部分：项目经费 */}
        <BudgetSection form={form} />

        {/* 第五部分：项目联系人 */}
        <ContactSection form={form} />

        {/* 错误提示 */}
        {submitError && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-sm">
            {submitError}
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="px-12 rounded-full h-14 text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? t.common.submitting : t.common.submit}
          </Button>
        </div>
      </form>
    </>
  )
}
