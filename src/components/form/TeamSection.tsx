import { useState } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, X, Check, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'

import type { ProjectFormData } from '@/types/form'
import { TITLES, EDUCATIONS, MEMBER_ROLES } from '@/lib/constants'
import { uploadResume } from '@/services/fileApi'

interface TeamSectionProps {
  form: UseFormReturn<ProjectFormData>
}

interface UploadState {
  [key: number]: {
    uploading: boolean
    fileName?: string
    error?: string
  }
}

export function TeamSection({ form }: TeamSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form
  const [uploadStates, setUploadStates] = useState<UploadState>({})
  const { showToast, ToastContainer } = useToast()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  })

  const addMember = () => {
    append({ role: '', resumeS3Key: '' })
  }

  const handleFileUpload = async (index: number, file: File) => {
    // 验证文件
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (!allowedTypes.includes(file.type)) {
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, error: '仅支持 PDF、DOC、DOCX 格式' }
      }))
      showToast('仅支持 PDF、DOC、DOCX 格式', 'error')
      return
    }

    if (file.size > maxSize) {
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, error: '文件大小不能超过 10MB' }
      }))
      showToast('文件大小不能超过 10MB', 'error')
      return
    }

    // 开始上传
    setUploadStates(prev => ({
      ...prev,
      [index]: { uploading: true, fileName: file.name }
    }))

    try {
      const s3Key = await uploadResume(file)
      setValue(`members.${index}.resumeS3Key`, s3Key)
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, fileName: file.name }
      }))
      showToast('简历上传成功', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传失败，请重试'
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, error: errorMessage }
      }))
      showToast(errorMessage, 'error')
    }
  }

  const clearUpload = (index: number) => {
    setValue(`members.${index}.resumeS3Key`, '')
    setUploadStates(prev => {
      const newStates = { ...prev }
      delete newStates[index]
      return newStates
    })
  }

  return (
    <>
      <ToastContainer />
      <FormSection title="项目组成员信息" description="填写项目负责人和其他成员信息">
        {/* 项目负责人信息 */}
        <div className="space-y-8">
          <h3 className="font-semibold text-lg">项目负责人</h3>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.name" required>
                姓名
              </FieldLabel>
              <Input
                id="leader.name"
                placeholder="请输入姓名"
                {...register('leader.name')}
              />
              <FieldError message={errors.leader?.name?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.orcid" optionalHint="（选填）">
                ORCID
              </FieldLabel>
              <Input
                id="leader.orcid"
                placeholder="请输入 ORCID"
                {...register('leader.orcid')}
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.email" required>
                联系邮箱
              </FieldLabel>
              <Input
                id="leader.email"
                type="email"
                placeholder="请输入邮箱"
                {...register('leader.email')}
              />
              <FieldError message={errors.leader?.email?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel required>职称</FieldLabel>
              <Select
                value={watch('leader.title')}
                onValueChange={(value) => setValue('leader.title', value)}
              >
                <SelectTrigger className={!watch('leader.title') ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="请选择职称" />
                </SelectTrigger>
                <SelectContent>
                  {TITLES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.leader?.title?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel required>学历</FieldLabel>
              <Select
                value={watch('leader.education')}
                onValueChange={(value) => setValue('leader.education', value)}
              >
                <SelectTrigger className={!watch('leader.education') ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="请选择学历" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.leader?.education?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="leader.bio" optionalHint="（选填，限200字符）">
              简介
            </FieldLabel>
            <Textarea
              id="leader.bio"
              placeholder="请简要描述项目主要负责人的主要研究方向、科研/项目成果（如代表性论文/专利）、项目经验（如已获得基金、项目等）等及在项目中承担的任务"
              className="min-h-[100px]"
              maxLength={200}
              {...register('leader.bio')}
            />
            <p className="text-xs text-muted-foreground text-right">
              {watch('leader.bio')?.length || 0}/200
            </p>
            <FieldError message={errors.leader?.bio?.message} />
          </div>
        </div>



        {/* 其他成员信息 */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">其他成员</h3>
            <Button type="button" variant="outline" size="sm" onClick={addMember} className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              添加成员
            </Button>
          </div>

          <div className="p-3 bg-blue-700/10 border border-blue-700/30 rounded text-sm text-blue-700">
            <span className="font-medium">简历说明：</span>描述曾参与的相关项目经验或背景，及简要描述在项目中承担的任务
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded">
              暂无其他成员，点击上方按钮添加
            </div>
          ) : (
            <div className="space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border border-border rounded-sm space-y-8 bg-background/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium font-mono">Member {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel required>角色</FieldLabel>
                      <Select
                        value={watch(`members.${index}.role`)}
                        onValueChange={(value) => setValue(`members.${index}.role`, value)}
                      >
                        <SelectTrigger className={!watch(`members.${index}.role`) ? "text-muted-foreground" : ""}>
                          <SelectValue placeholder="请选择角色" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEMBER_ROLES.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.members?.[index]?.role?.message} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel optionalHint="（可选，PDF/DOC/DOCX，最大10MB）">
                        成员简历
                      </FieldLabel>

                      {!uploadStates[index]?.fileName && !watch(`members.${index}.resumeS3Key`) ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(index, file)
                              }
                            }}
                            disabled={uploadStates[index]?.uploading}
                            className="cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 border border-border rounded-sm bg-muted/50">
                          {uploadStates[index]?.uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm flex-1">上传中...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-sm flex-1 truncate">
                                {uploadStates[index]?.fileName || '已上传'}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => clearUpload(index)}
                                className="h-6 w-6 p-0 rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      <FieldError message={uploadStates[index]?.error} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>
    </>
  )
}
