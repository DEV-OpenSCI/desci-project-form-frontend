import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'

interface ContactSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function ContactSection({ form }: ContactSectionProps) {
  const { register, formState: { errors } } = form

  return (
    <FormSection title="项目联系人" description="填写项目联系人的信息，用于后续沟通联络">
      <div className="grid gap-8 md:grid-cols-3">
        {/* 姓名 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.name" required>
            姓名
          </FieldLabel>
          <Input
            id="contact.name"
            placeholder="请输入联系人姓名"
            {...register('contact.name')}
          />
          <FieldError message={errors.contact?.name?.message} />
        </div>

        {/* 联系邮箱 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.email" required>
            联系邮箱
          </FieldLabel>
          <Input
            id="contact.email"
            type="email"
            placeholder="请输入联系邮箱"
            {...register('contact.email')}
          />
          <FieldError message={errors.contact?.email?.message} />
        </div>

        {/* 联系电话 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.phone" required>
            联系电话
          </FieldLabel>
          <Input
            id="contact.phone"
            type="tel"
            placeholder="请输入联系电话"
            {...register('contact.phone')}
          />
          <FieldError message={errors.contact?.phone?.message} />
        </div>
      </div>
    </FormSection>
  )
}
