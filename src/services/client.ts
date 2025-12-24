import axios from 'axios'
import { getFillCode } from '@/lib/auth'
import { en } from '@/i18n/en'
import { zh } from '@/i18n/zh'

// 创建 axios 实例
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：自动添加填写码
client.interceptors.request.use(
  (config) => {
    const fillCode = getFillCode()
    if (fillCode) {
      config.headers['X-Fill-Code'] = fillCode
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API 错误类，用于携带后端返回的错误信息
export class ApiError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function getLanguage() {
  if (typeof window === 'undefined') return 'zh'
  return window.localStorage.getItem('language') === 'en' ? 'en' : 'zh'
}

function getMessages() {
  const language = getLanguage()
  return (language === 'en' ? en : zh).messages
}

// 响应拦截器：统一处理错误和响应格式
client.interceptors.response.use(
  (response) => {
    const data = response.data

    // 检查业务状态码，如果 success 为 false 则抛出错误
    if (data && data.success === false) {
      const messages = getMessages()
      const fallbackMessage = messages.requestFailed
      const message = getLanguage() === 'en' ? fallbackMessage : (data.message || fallbackMessage)
      return Promise.reject(new ApiError(message, data.code || 500))
    }

    // 直接返回 data 字段
    return data
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      const fallbackMessage = getDefaultErrorMessage(status)
      const message = getLanguage() === 'en' ? fallbackMessage : (data?.message || fallbackMessage)

      return Promise.reject(new ApiError(message, status))
    } else if (error.request) {
      // 请求已发出但没有收到响应
      const messages = getMessages()
      return Promise.reject(new ApiError(messages.networkError, 0))
    } else {
      // 其他错误
      const messages = getMessages()
      return Promise.reject(new ApiError(error.message || messages.genericRequestError, 0))
    }
  }
)

// 根据状态码获取默认错误消息
function getDefaultErrorMessage(status: number): string {
  const messages = getMessages()
  switch (status) {
    case 400:
      return messages.requestParamsError
    case 401:
      return messages.fillCodeExpired
    case 403:
      return messages.noPermission
    case 404:
      return messages.notFound
    case 500:
      return messages.serverError
    case 503:
      return messages.serviceUnavailable
    default:
      return messages.requestFailed
  }
}

export default client
