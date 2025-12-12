// API 请求和响应类型定义

// 统一响应格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: string
  success: boolean
}

// 填写码校验响应
export interface FillCodeValidation {
  valid: boolean
  expireTime: string | null
  message: string | null
}

// 下拉选项
export interface SelectOption {
  value: string
  label: string
  description?: string
}

// S3 预签名 URL 请求
export interface PresignedUrlRequest {
  fileName: string
  fileType: string
  fileSize: number
}

// S3 预签名 URL 响应
export interface PresignedUrlResponse {
  uploadUrl: string
  s3Key: string
  expiresIn: number
}

// AI 文档解析响应
export interface AiParseResponse {
  content: string
}

// 表单提交响应
export interface SubmitResponse {
  applicationNo: string
}

// 表单提交请求 - API 格式
export interface ApiFormData {
  basicInfo: {
    name: string
    startDate: string
    endDate: string
    discipline: string
    researchField: string
    teamSize: number
  }
  leader: {
    name: string
    orcid?: string
    email: string
    title: string
    education: string
    bio?: string
  }
  members: Array<{
    role: string
    resumeS3Key?: string
  }>
  introduction: string
  background: string
  milestones: Array<{
    phase: string
    startDate: string
    endDate: string
    content: string
    goals: string[]
  }>
  budgets: Array<{
    category: string
    donationAmount: number
    selfFundedAmount: number
  }>
  contact: {
    name: string
    email: string
    phone: string
  }
}
