import client from './client'
import type { ApiResponse, ApiFormData, SubmitResponse } from './types'
import type { ProjectFormData } from '@/types/form'
import { en } from '@/i18n/en'
import { zh } from '@/i18n/zh'

/**
 * 日期格式化为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 将前端表单数据转换为 API 请求格式
 */
export function formDataToApiPayload(data: ProjectFormData): ApiFormData {
  return {
    basicInfo: {
      name: data.projectName,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
      discipline: data.discipline,
      researchField: data.field,
      teamSize: data.teamSize,
    },
    leader: {
      name: data.leader.name,
      orcid: data.leader.orcid || undefined,
      email: data.leader.email,
      title: data.leader.title,
      education: data.leader.education,
      bio: data.leader.bio || undefined,
    },
    members: data.members.map((m) => ({
      role: m.role,
      resumeS3Key: m.resumeS3Key,
    })),
    introduction: data.projectSummary,
    background: data.background,
    milestones: data.milestones.map((m) => ({
      phase: m.stage,
      startDate: formatDate(m.startDate),
      endDate: formatDate(m.endDate),
      content: m.content,
      goals: m.goals.split('\n').filter((g) => g.trim()), // 将换行分隔的字符串转为数组
    })),
    budgets: data.budgetItems.map((b) => ({
      category: b.category,
      donationAmount: b.donationAmount,
      selfFundedAmount: b.selfFundedAmount,
    })),
    contact: {
      name: data.contact.name,
      email: data.contact.email,
      phone: data.contact.phone,
    },
  }
}

/**
 * 提交项目申请表单
 */
export async function submitApplication(
  data: ProjectFormData
): Promise<string> {
  const payload = formDataToApiPayload(data)

  const response = await client.post<never, ApiResponse<SubmitResponse>>(
    '/project-form/application/submit',
    payload
  )

  // 确保返回数据存在
  if (!response.data?.applicationNo) {
    const language = typeof window !== 'undefined' && window.localStorage.getItem('language') === 'en' ? 'en' : 'zh'
    const messages = (language === 'en' ? en : zh).messages
    throw new Error(messages.missingApplicationNo)
  }

  return response.data.applicationNo
}
