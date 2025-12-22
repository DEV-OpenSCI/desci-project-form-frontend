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
import { projectFormSchema, type ProjectFormData } from '@/types/form'
import { MILESTONE_STAGES } from '@/lib/constants'
import { submitApplication } from '@/services/formApi'
import { useFillCode } from '@/contexts/FillCodeContext'

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
    projectName: '基于区块链的去中心化科研数据共享平台研究',
    startDate,
    endDate,
    discipline: 'information',
    field: 'materials',
    teamSize: 5,
    leader: {
      name: '张三',
      orcid: '0000-0002-1234-5678',
      email: 'zhangsan@example.edu.cn',
      title: 'professor',
      education: 'phd',
      bio: '长期从事分布式系统和区块链技术研究，发表SCI论文30余篇。',
    },
    members: [
      { role: '数据工程师', resumeS3Key: '' },
      { role: '前端开发工程师', resumeS3Key: '' },
    ],
    projectSummary: '当前科研数据共享面临信任缺失、激励不足、隐私泄露等问题。本项目拟采用区块链技术构建去中心化的科研数据共享平台，通过智能合约实现数据确权、访问控制和贡献激励，利用零知识证明保护数据隐私，从而促进科研数据的安全、高效流通，推动开放科学发展。',
    background: '随着大数据时代的到来，科研数据已成为重要的战略资源。然而，现有的中心化数据共享模式存在诸多问题：数据孤岛现象严重、共享意愿不足、数据确权困难、隐私保护薄弱等。区块链技术的去中心化、不可篡改、可追溯等特性，为解决这些问题提供了新的思路。本项目的实施将有助于打破科研数据壁垒，提升科研协作效率，加速科技创新。',
    milestones: [
      {
        stage: 'early',
        startDate: phase1Start,
        endDate: phase1End,
        content: '完成系统架构设计和核心模块开发',
        goals: '完成需求分析和系统设计文档\n完成区块链底层选型和适配\n开发数据确权智能合约',
      },
      {
        stage: 'mid',
        startDate: phase2Start,
        endDate: phase2End,
        content: '完成平台主要功能开发和测试',
        goals: '完成数据共享和访问控制模块\n完成激励机制设计和实现\n发表SCI论文2篇',
      },
      {
        stage: 'late',
        startDate: phase3Start,
        endDate: phase3End,
        content: '完成系统集成测试和示范应用',
        goals: '完成系统性能优化和安全审计\n在3个以上科研机构进行示范应用\n申请发明专利2项',
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
      name: '李四',
      email: 'lisi@example.edu.cn',
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

  // 检测是否为测试模式
  const isTestMode = new URLSearchParams(window.location.search).get('test') === 'true'

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
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
      milestones: MILESTONE_STAGES.map((stage) => ({
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
        error instanceof Error ? error.message : '提交失败，请稍后重试'
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
      `请检查表单，还有 ${errorCount} 项必填内容未填写`,
      'warning'
    )

    // 滚动到第一个错误字段
    const firstErrorField = getFirstErrorFieldName(errors)
    if (firstErrorField) {
      setTimeout(() => scrollToErrorField(firstErrorField), 100)
    }
  }, [showToast])

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
            {isSubmitting ? '提交中...' : '提交申请'}
          </Button>
        </div>
      </form>
    </>
  )
}
