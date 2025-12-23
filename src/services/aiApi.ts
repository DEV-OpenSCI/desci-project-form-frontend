import client from './client'
import type { ApiResponse, AiParseResponse } from './types'

/**
 * AI 文档解析
 * @param file 文档文件
 * @param type 解析类型: introduction(项目简介) 或 background(背景意义)
 * @param language 目标语言: 'en' 或 'zh'
 */
export async function parseDocument(
  file: File,
  type: 'introduction' | 'background',
  language: 'en' | 'zh' = 'en'
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  formData.append('language', language)

  const response = await client.post<never, ApiResponse<AiParseResponse>>(
    '/project-form/ai/parse-document',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data.content
}
