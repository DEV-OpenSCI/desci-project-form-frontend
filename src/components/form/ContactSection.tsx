import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { ProjectFormData } from '@/types/form'

interface ContactSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function ContactSection({ form }: ContactSectionProps) {
  const { register, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">项目联系人</CardTitle>
        <CardDescription>填写项目联系人的信息，用于后续沟通联络</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* 姓名 */}
          <div className="space-y-2">
            <Label htmlFor="contact.name">
              姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact.name"
              placeholder="请输入联系人姓名"
              {...register('contact.name')}
            />
            {errors.contact?.name && (
              <p className="text-sm text-destructive">{errors.contact.name.message}</p>
            )}
          </div>

          {/* 联系邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="contact.email">
              联系邮箱 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact.email"
              type="email"
              placeholder="请输入联系邮箱"
              {...register('contact.email')}
            />
            {errors.contact?.email && (
              <p className="text-sm text-destructive">{errors.contact.email.message}</p>
            )}
          </div>

          {/* 联系电话 */}
          <div className="space-y-2">
            <Label htmlFor="contact.phone">
              联系电话 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact.phone"
              type="tel"
              placeholder="请输入联系电话"
              {...register('contact.phone')}
            />
            {errors.contact?.phone && (
              <p className="text-sm text-destructive">{errors.contact.phone.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
