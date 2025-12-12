import client from './client'
import type { ApiResponse, SelectOption } from './types'

/**
 * 获取指定类型的下拉选项
 */
export async function getOptions(type: string): Promise<SelectOption[]> {
  const response = await client.get<never, ApiResponse<SelectOption[]>>(
    `/project-form/options/${type}`
  )
  return response.data
}

/**
 * 批量获取所有下拉选项
 */
export async function getAllOptions(): Promise<{
  disciplines: SelectOption[]
  researchFields: SelectOption[]
  titles: SelectOption[]
  educations: SelectOption[]
  budgetCategories: SelectOption[]
}> {
  const [disciplines, researchFields, titles, educations, budgetCategories] =
    await Promise.all([
      getOptions('discipline'),
      getOptions('researchField'),
      getOptions('title'),
      getOptions('education'),
      getOptions('budgetCategory'),
    ])

  return {
    disciplines,
    researchFields,
    titles,
    educations,
    budgetCategories,
  }
}
