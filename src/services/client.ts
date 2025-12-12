import axios from 'axios'
import { getFillCode } from '@/lib/auth'

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

// 响应拦截器：统一处理错误和响应格式
client.interceptors.response.use(
  (response) => {
    const data = response.data

    // 检查业务状态码，如果 success 为 false 则抛出错误
    if (data && data.success === false) {
      return Promise.reject(new ApiError(data.message || '请求失败', data.code || 500))
    }

    // 直接返回 data 字段
    return data
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || getDefaultErrorMessage(status)

      return Promise.reject(new ApiError(message, status))
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return Promise.reject(new ApiError('网络错误，请检查网络连接', 0))
    } else {
      // 其他错误
      return Promise.reject(new ApiError(error.message || '请求错误', 0))
    }
  }
)

// 根据状态码获取默认错误消息
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return '请求参数错误'
    case 401:
      return '填写码无效或已过期'
    case 403:
      return '没有权限执行此操作'
    case 404:
      return '请求的资源不存在'
    case 500:
      return '服务器错误，请稍后重试'
    case 503:
      return '服务暂时不可用，请稍后重试'
    default:
      return '请求失败，请稍后重试'
  }
}

export default client
