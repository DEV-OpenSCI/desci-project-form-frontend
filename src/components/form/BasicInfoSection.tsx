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
import { DISCIPLINES, RESEARCH_FIELDS } from '@/lib/constants'

interface BasicInfoSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form

  return (
    <FormSection title="项目基本信息">
      {/* 项目名称 */}
      <div className="space-y-2">
        <FieldLabel htmlFor="projectName" required>
          项目名称
        </FieldLabel>
        <Input
          id="projectName"
          placeholder="请输入项目名称"
          {...register('projectName')}
        />
        <FieldError message={errors.projectName?.message} />
      </div>

      {/* 预期起止时间 */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>预期开始时间</FieldLabel>
          <DatePicker
            date={watch('startDate')}
            onSelect={(date) => setValue('startDate', date as Date)}
            placeholder="选择开始日期"
          />
          <FieldError message={errors.startDate?.message} />
        </div>
        <div className="space-y-2">
          <FieldLabel required>预期结束时间</FieldLabel>
          <DatePicker
            date={watch('endDate')}
            onSelect={(date) => setValue('endDate', date as Date)}
            placeholder="选择结束日期"
          />
          <FieldError message={errors.endDate?.message} />
        </div>
      </div>

      {/* 所属专项和领域 */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel required>所属专项（一级学科）</FieldLabel>
          <Select
            value={watch('discipline')}
            onValueChange={(value) => setValue('discipline', value)}
          >
            <SelectTrigger className={!watch('discipline') ? "text-muted-foreground" : ""}>
              <SelectValue placeholder="请选择所属专项" />
            </SelectTrigger>
            <SelectContent>
              {DISCIPLINES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.discipline?.message} />
        </div>
        <div className="space-y-2">
          <FieldLabel required>所属领域</FieldLabel>
          <Select
            value={watch('field')}
            onValueChange={(value) => setValue('field', value)}
          >
            <SelectTrigger className={!watch('field') ? "text-muted-foreground" : ""}>
              <SelectValue placeholder="请选择所属领域" />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_FIELDS.map((item) => (
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
          项目人数
        </FieldLabel>
        <Input
          id="teamSize"
          type="number"
          min={1}
          placeholder="请输入项目人数"
          {...register('teamSize', { valueAsNumber: true })}
        />
        <FieldError message={errors.teamSize?.message} />
      </div>
    </FormSection>
  )
}
