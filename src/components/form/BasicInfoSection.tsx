import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'
import { useTranslation } from '@/i18n'

interface BasicInfoSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form
  const { t } = useTranslation()

  return (
    <FormSection title={t.sections.basicInfo.title}>
      {/* 项目名称 */}
      <div className="space-y-2">
        <FieldLabel htmlFor="projectName" required>
          {t.sections.basicInfo.projectName}
        </FieldLabel>
        <Input
          id="projectName"
          placeholder={t.sections.basicInfo.projectNamePlaceholder}
          {...register('projectName')}
        />
        <FieldError message={errors.projectName?.message} />
      </div>

      {/* 预期起止时间 */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>{t.sections.basicInfo.startDate}</FieldLabel>
          <DatePicker
            date={watch('startDate')}
            onSelect={(date) => setValue('startDate', date as Date)}
            placeholder={t.sections.basicInfo.selectDate}
          />
          <FieldError message={errors.startDate?.message} />
        </div>
        <div className="space-y-2">
          <FieldLabel required>{t.sections.basicInfo.endDate}</FieldLabel>
          <DatePicker
            date={watch('endDate')}
            onSelect={(date) => setValue('endDate', date as Date)}
            placeholder={t.sections.basicInfo.selectDate}
          />
          <FieldError message={errors.endDate?.message} />
        </div>
      </div>

      {/* 所属专项和领域 */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>{t.sections.basicInfo.discipline}</FieldLabel>
          <Select
            value={watch('discipline')}
            onValueChange={(value) => setValue('discipline', value)}
          >
            <SelectTrigger className={!watch('discipline') ? "text-muted-foreground" : ""}>
              <SelectValue placeholder={t.sections.basicInfo.disciplinePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {t.options.disciplines.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.discipline?.message} />
        </div>
        <div className="space-y-2">
          <FieldLabel required>{t.sections.basicInfo.field}</FieldLabel>
          <Select
            value={watch('field')}
            onValueChange={(value) => setValue('field', value)}
          >
            <SelectTrigger className={!watch('field') ? "text-muted-foreground" : ""}>
              <SelectValue placeholder={t.sections.basicInfo.fieldPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {t.options.researchFields.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.field?.message} />
        </div>
      </div>

      {/* 项目人数 */}
      <div className="space-y-2 md:w-1/2">
        <FieldLabel htmlFor="teamSize" required>
          {t.sections.basicInfo.teamSize}
        </FieldLabel>
        <Input
          id="teamSize"
          type="number"
          min={1}
          placeholder={t.sections.basicInfo.teamSizePlaceholder}
          {...register('teamSize', { valueAsNumber: true })}
        />
        <FieldError message={errors.teamSize?.message} />
      </div>
    </FormSection>
  )
}
