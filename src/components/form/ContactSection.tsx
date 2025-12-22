import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'
import { useTranslation } from '@/i18n'

interface ContactSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function ContactSection({ form }: ContactSectionProps) {
  const { register, formState: { errors } } = form
  const { t } = useTranslation()

  return (
    <FormSection title={t.sections.contact.title} description={t.sections.contact.description}>
      <div className="grid gap-8 md:grid-cols-3">
        {/* 姓名 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.name" required>
            {t.sections.contact.name}
          </FieldLabel>
          <Input
            id="contact.name"
            placeholder={t.sections.contact.namePlaceholder}
            {...register('contact.name')}
          />
          <FieldError message={errors.contact?.name?.message} />
        </div>

        {/* 联系邮箱 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.email" required>
            {t.sections.contact.email}
          </FieldLabel>
          <Input
            id="contact.email"
            type="email"
            placeholder={t.sections.contact.emailPlaceholder}
            {...register('contact.email')}
          />
          <FieldError message={errors.contact?.email?.message} />
        </div>

        {/* 联系电话 */}
        <div className="space-y-2">
          <FieldLabel htmlFor="contact.phone" required>
            {t.sections.contact.phone}
          </FieldLabel>
          <Input
            id="contact.phone"
            type="tel"
            placeholder={t.sections.contact.phonePlaceholder}
            {...register('contact.phone')}
          />
          <FieldError message={errors.contact?.phone?.message} />
        </div>
      </div>
    </FormSection>
  )
}
