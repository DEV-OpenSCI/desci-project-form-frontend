import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DISCIPLINES, RESEARCH_FIELDS } from '@/lib/constants'
import type { ProjectFormData } from '@/types/form'

interface BasicInfoSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">项目基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 项目名称 */}
        <div className="space-y-2">
          <Label htmlFor="projectName">
            项目名称 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="projectName"
            placeholder="请输入项目名称"
            {...register('projectName')}
          />
          {errors.projectName && (
            <p className="text-sm text-destructive">{errors.projectName.message}</p>
          )}
        </div>

        {/* 预期起止时间 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              预期开始时间 <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              date={watch('startDate')}
              onSelect={(date) => setValue('startDate', date as Date)}
              placeholder="选择开始日期"
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>
              预期结束时间 <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              date={watch('endDate')}
              onSelect={(date) => setValue('endDate', date as Date)}
              placeholder="选择结束日期"
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* 所属专项和领域 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              所属专项（一级学科） <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('discipline')}
              onValueChange={(value) => setValue('discipline', value)}
            >
              <SelectTrigger>
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
            {errors.discipline && (
              <p className="text-sm text-destructive">{errors.discipline.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>
              所属领域 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch('field')}
              onValueChange={(value) => setValue('field', value)}
            >
              <SelectTrigger>
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
            {errors.field && (
              <p className="text-sm text-destructive">{errors.field.message}</p>
            )}
          </div>
        </div>

        {/* 项目人数 */}
        <div className="space-y-2 md:w-1/2">
          <Label htmlFor="teamSize">
            项目人数 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="teamSize"
            type="number"
            min={1}
            placeholder="请输入项目人数"
            {...register('teamSize', { valueAsNumber: true })}
          />
          {errors.teamSize && (
            <p className="text-sm text-destructive">{errors.teamSize.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
