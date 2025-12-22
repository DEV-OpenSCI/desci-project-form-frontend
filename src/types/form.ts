import { z } from 'zod'
import type { Translations } from '@/i18n'

// 项目负责人信息
export const createLeaderSchema = (t: Translations) => z.object({
  name: z.string().min(1, t.validation.nameRequired),
  orcid: z.string().optional(),
  email: z.string().email(t.validation.validEmail),
  title: z.string().min(1, t.validation.titleRequired),
  education: z.string().min(1, t.validation.educationRequired),
  bio: z.string().max(200, t.validation.bioMax).optional(),
})

// 成员信息
export const createMemberSchema = (t: Translations) => z.object({
  role: z.string().min(1, t.validation.roleRequired),
  resumeS3Key: z.string().optional(), // S3 文件键，从上传接口获取
})

// 里程碑
export const createMilestoneSchema = (t: Translations) => z.object({
  stage: z.string(),
  startDate: z.date({ required_error: t.validation.startDateRequired }),
  endDate: z.date({ required_error: t.validation.endDateRequired }),
  content: z.string().min(1, t.validation.mainContentRequired),
  goals: z.string().min(1, t.validation.goalsRequired), // 前端使用字符串，提交时转为数组
})

// 经费
export const createBudgetItemSchema = (t: Translations) => z.object({
  category: z.string().min(1, t.validation.categoryRequired),
  donationAmount: z.number().min(0, t.validation.nonNegativeAmount), // API 字段名
  selfFundedAmount: z.number().min(0, t.validation.nonNegativeAmount), // API 字段名
})

// 联系人
export const createContactSchema = (t: Translations) => z.object({
  name: z.string().min(1, t.validation.contactNameRequired),
  email: z.string().email(t.validation.contactEmailValid),
  phone: z.string().min(1, t.validation.contactPhoneRequired),
})

// 完整表单
export const createProjectFormSchema = (t: Translations) => z.object({
  // 第一部分：项目基本信息
  projectName: z.string().min(1, t.validation.projectNameRequired),
  startDate: z.date({ required_error: t.validation.startDateRequired }),
  endDate: z.date({ required_error: t.validation.endDateRequired }),
  discipline: z.string().min(1, t.validation.disciplineRequired),
  field: z.string().min(1, t.validation.fieldRequired),
  teamSize: z.number().min(1, t.validation.teamSizeMin),

  // 第二部分：成员信息
  leader: createLeaderSchema(t),
  members: z.array(createMemberSchema(t)),

  // 第三部分：项目介绍
  projectSummary: z.string().min(1, t.validation.projectSummaryRequired).max(1500, t.validation.projectSummaryMax),
  background: z.string().min(1, t.validation.backgroundRequired).max(1500, t.validation.backgroundMax),
  milestones: z.array(createMilestoneSchema(t)).length(3, t.validation.milestonesLength),

  // 第四部分：项目经费
  budgetItems: z.array(createBudgetItemSchema(t)).min(1, t.validation.budgetItemMin),

  // 第五部分：联系人
  contact: createContactSchema(t),
})

export type ProjectFormData = z.infer<ReturnType<typeof createProjectFormSchema>>
export type Leader = z.infer<ReturnType<typeof createLeaderSchema>>
export type Member = z.infer<ReturnType<typeof createMemberSchema>>
export type Milestone = z.infer<ReturnType<typeof createMilestoneSchema>>
export type BudgetItem = z.infer<ReturnType<typeof createBudgetItemSchema>>
export type Contact = z.infer<ReturnType<typeof createContactSchema>>
