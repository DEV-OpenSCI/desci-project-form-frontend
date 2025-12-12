import client from './client'
import type { ApiResponse, FillCodeValidation } from './types'

/**
 * 校验填写码是否有效
 */
export async function validateFillCode(
  fillCode: string
): Promise<FillCodeValidation> {
  const response = await client.get<never, ApiResponse<FillCodeValidation>>(
    '/project-form/fill-code/validate',
    {
      headers: {
        'X-Fill-Code': fillCode,
      },
    }
  )
  return response.data
}
