import axios from 'axios'
import client from './client'
import type {
  ApiResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from './types'

/**
 * 获取 S3 预签名 URL
 */
export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const response = await client.post<never, ApiResponse<PresignedUrlResponse>>(
    '/project-form/file/presigned-url',
    request
  )
  return response.data
}

/**
 * 上传文件到 S3
 */
export async function uploadToS3(
  uploadUrl: string,
  file: File
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  })
}

/**
 * 完整的简历上传流程
 * @returns S3 Key
 */
export async function uploadResume(file: File): Promise<string> {
  // 1. 获取预签名 URL
  const { uploadUrl, s3Key } = await getPresignedUrl({
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  })

  // 2. 上传到 S3
  await uploadToS3(uploadUrl, file)

  // 3. 返回 s3Key
  return s3Key
}
