import { useState, useRef } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, X, Check, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { uploadResume } from '@/services/fileApi'
import { useTranslation } from '@/i18n'

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
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const { showToast, ToastContainer } = useToast()
  const { t } = useTranslation()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  })

  const addMember = () => {
    append({ role: '', resumeS3Key: '' })
  }

  const handleFileUpload = async (index: number, file: File) => {
    // Validate file
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    if (!allowedTypes.includes(file.type)) {
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, error: t.messages.fileTypeNotSupported }
      }))
      showToast(t.messages.fileTypeNotSupported, 'error')
      return
    }

    if (file.size > maxSize) {
      setUploadStates(prev => ({
        ...prev,
        [index]: { uploading: false, error: t.messages.fileTooLarge10 }
      }))
      showToast(t.messages.fileTooLarge10, 'error')
      return
    }

    // Start upload
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
      showToast(t.messages.resumeUploadSuccess, 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t.messages.uploadFailed
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
      <FormSection title={t.sections.team.title} description={t.sections.team.description}>
        {/* Project leader information */}
        <div className="space-y-8">
          <h3 className="font-semibold text-lg">{t.sections.team.leader}</h3>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.name" required>
                {t.sections.team.name}
              </FieldLabel>
              <Input
                id="leader.name"
                placeholder={t.sections.team.namePlaceholder}
                {...register('leader.name')}
              />
              <FieldError message={errors.leader?.name?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.orcid" optionalHint={t.sections.team.orcidHint}>
                {t.sections.team.orcid}
              </FieldLabel>
              <Input
                id="leader.orcid"
                placeholder={t.sections.team.orcidPlaceholder}
                {...register('leader.orcid')}
              />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel htmlFor="leader.email" required>
                {t.sections.team.email}
              </FieldLabel>
              <Input
                id="leader.email"
                type="email"
                placeholder={t.sections.team.emailPlaceholder}
                {...register('leader.email')}
              />
              <FieldError message={errors.leader?.email?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel required>{t.sections.team.titleLabel}</FieldLabel>
              <Select
                value={watch('leader.title')}
                onValueChange={(value) => setValue('leader.title', value)}
              >
                <SelectTrigger className={!watch('leader.title') ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder={t.sections.team.titlePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {t.options.titles.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.leader?.title?.message} />
            </div>
            <div className="space-y-2">
              <FieldLabel required>{t.sections.team.education}</FieldLabel>
              <Select
                value={watch('leader.education')}
                onValueChange={(value) => setValue('leader.education', value)}
              >
                <SelectTrigger className={!watch('leader.education') ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder={t.sections.team.educationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {t.options.educations.map((item) => (
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
            <FieldLabel htmlFor="leader.bio" optionalHint={t.sections.team.bioHint}>
              {t.sections.team.bio}
            </FieldLabel>
            <Textarea
              id="leader.bio"
              placeholder={t.sections.team.bioPlaceholder}
              className="min-h-[100px]"
              maxLength={200}
              {...register('leader.bio')}
            />
            <p className="text-sm text-muted-foreground text-right">
              {watch('leader.bio')?.length || 0}/200
            </p>
            <FieldError message={errors.leader?.bio?.message} />
          </div>
        </div>



        {/* Other member information */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{t.sections.team.otherMembers}</h3>
            <Button type="button" variant="outline" size="sm" onClick={addMember} className="rounded-full text-sm">
              <Plus className="h-4 w-4 mr-1" />
              {t.sections.team.addMember}
            </Button>
          </div>

          <div className="p-3 bg-blue-700/10 border border-blue-700/30 rounded text-sm text-blue-700">
            <span className="font-medium">{t.sections.team.resumeNote}</span>{t.sections.team.resumeNoteText}
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded">
              {t.sections.team.noMembers}
            </div>
          ) : (
            <div className="space-y-8">
              {fields.map((field, index) => (
                <div key={field.id} className="p-6 border border-border rounded-sm space-y-8 bg-background/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono">{t.sections.team.member} {index + 1}</span>
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
                      <FieldLabel required>{t.sections.team.role}</FieldLabel>
                      <Select
                        value={watch(`members.${index}.role`)}
                        onValueChange={(value) => setValue(`members.${index}.role`, value)}
                      >
                        <SelectTrigger className={!watch(`members.${index}.role`) ? "text-muted-foreground" : ""}>
                          <SelectValue placeholder={t.sections.team.rolePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {t.options.memberRoles.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.members?.[index]?.role?.message} />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel required>
                        {t.sections.team.resume}
                      </FieldLabel>

                      {!uploadStates[index]?.fileName && !watch(`members.${index}.resumeS3Key`) ? (
                        <div className="space-y-2">
                          <input
                            ref={(el) => { fileInputRefs.current[index] = el }}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(index, file)
                              }
                            }}
                            className="sr-only"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            disabled={uploadStates[index]?.uploading}
                            className="flex h-12 w-full items-center gap-3 rounded border border-input bg-background px-3 py-2 text-base transition-all hover:bg-muted/50 hover:border-input/80 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              <Upload className="h-3.5 w-3.5" />
                              {t.sections.team.chooseFile}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {t.sections.team.noFileSelected}
                            </span>
                          </button>
                          <p className="text-sm text-muted-foreground">
                            {t.sections.team.resumeHint}
                          </p>
                        </div>
                      ) : (
                        <div className="flex h-12 w-full items-center gap-3 rounded border border-input bg-muted/5 px-3 py-2 text-base text-foreground transition-all hover:bg-muted/20 hover:border-input/80">
                          {uploadStates[index]?.uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm text-muted-foreground flex-1">{t.sections.team.uploading}</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium flex-1 truncate">
                                {uploadStates[index]?.fileName || t.sections.team.uploaded}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => clearUpload(index)}
                                className="h-6 w-6 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}

                      <FieldError message={uploadStates[index]?.error || errors.members?.[index]?.resumeS3Key?.message} />
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
