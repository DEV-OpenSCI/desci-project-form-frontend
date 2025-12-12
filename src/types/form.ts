import { z } from 'zod'

// 项目负责人信息
export const leaderSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  orcid: z.string().optional(),
  email: z.string().email('请输入有效的邮箱地址'),
  title: z.string().min(1, '请选择职称'),
  education: z.string().min(1, '请选择学历'),
  bio: z.string().max(200, '简介不能超过200字符').optional(),
})

// 成员信息
export const memberSchema = z.object({
  role: z.string().min(1, '请选择角色'),
  resumeS3Key: z.string().optional(), // S3 文件键，从上传接口获取
})

// 里程碑
export const milestoneSchema = z.object({
  stage: z.string(),
  startDate: z.date({ required_error: '请选择开始日期' }),
  endDate: z.date({ required_error: '请选择结束日期' }),
  content: z.string().min(1, '请输入主要研究内容'),
  goals: z.string().min(1, '请输入预期目标'), // 前端使用字符串，提交时转为数组
})

// 经费
export const budgetItemSchema = z.object({
  category: z.string().min(1, '请选择经费类别'),
  donationAmount: z.number().min(0, '金额不能为负'), // API 字段名
  selfFundedAmount: z.number().min(0, '金额不能为负'), // API 字段名
})

// 联系人
export const contactSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().min(1, '请输入联系电话'),
})

// 完整表单
export const projectFormSchema = z.object({
  // 第一部分：项目基本信息
  projectName: z.string().min(1, '请输入项目名称'),
  startDate: z.date({ required_error: '请选择开始日期' }),
  endDate: z.date({ required_error: '请选择结束日期' }),
  discipline: z.string().min(1, '请选择所属专项'),
  field: z.string().min(1, '请选择所属领域'),
  teamSize: z.number().min(1, '项目人数至少为1'),

  // 第二部分：成员信息
  leader: leaderSchema,
  members: z.array(memberSchema),

  // 第三部分：项目介绍
  projectSummary: z.string().min(1, '请输入项目简介').max(1500, '项目简介不能超过1500字'),
  background: z.string().min(1, '请输入实施的背景和意义').max(1500, '背景和意义不能超过1500字'),
  milestones: z.array(milestoneSchema).length(3, '需要填写三个阶段的里程碑'),

  // 第四部分：项目经费
  budgetItems: z.array(budgetItemSchema).min(1, '请至少添加一项经费'),

  // 第五部分：联系人
  contact: contactSchema,
})

export type ProjectFormData = z.infer<typeof projectFormSchema>
export type Leader = z.infer<typeof leaderSchema>
export type Member = z.infer<typeof memberSchema>
export type Milestone = z.infer<typeof milestoneSchema>
export type BudgetItem = z.infer<typeof budgetItemSchema>
export type Contact = z.infer<typeof contactSchema>
