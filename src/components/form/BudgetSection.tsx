import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BUDGET_CATEGORIES } from '@/lib/constants'
import type { ProjectFormData } from '@/types/form'

interface BudgetSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function BudgetSection({ form }: BudgetSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'budgetItems',
  })

  const addBudgetItem = () => {
    append({ category: '', donationAmount: 0, selfFundedAmount: 0 })
  }

  // 计算总额
  const budgetItems = watch('budgetItems') || []
  const totalDonation = budgetItems.reduce((sum, item) => sum + (item.donationAmount || 0), 0)
  const totalSelfFund = budgetItems.reduce((sum, item) => sum + (item.selfFundedAmount || 0), 0)
  const total = totalDonation + totalSelfFund

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">项目经费</CardTitle>
        <CardDescription>研究人员提交经费列表，总额作为捐赠/资助的软顶目标</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 经费类别说明 */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">经费类别说明</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {BUDGET_CATEGORIES.map((item) => (
              <li key={item.value}>
                <span className="font-medium text-foreground">{item.label}：</span>
                {item.description}
              </li>
            ))}
          </ul>
        </div>

        {/* 经费列表 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">经费明细</h3>
            <Button type="button" variant="outline" size="sm" onClick={addBudgetItem}>
              <Plus className="h-4 w-4 mr-1" />
              添加经费项
            </Button>
          </div>

          {/* 表头 */}
          <div className="hidden md:grid md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 bg-muted rounded-t-lg font-medium text-sm">
            <div className="w-12">序号</div>
            <div>经费类别</div>
            <div>捐赠/资助额（元）</div>
            <div>项目自筹经费（元）</div>
            <div className="w-10"></div>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              暂无经费项，点击上方按钮添加
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-start p-4 border rounded-lg"
                >
                  {/* 序号 */}
                  <div className="hidden md:flex items-center justify-center w-12 h-9 bg-muted rounded font-medium">
                    {index + 1}
                  </div>

                  {/* 经费类别 */}
                  <div className="space-y-2">
                    <Label className="md:hidden">经费类别</Label>
                    <Select
                      value={watch(`budgetItems.${index}.category`)}
                      onValueChange={(value) => setValue(`budgetItems.${index}.category`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择经费类别" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_CATEGORIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.budgetItems?.[index]?.category && (
                      <p className="text-sm text-destructive">
                        {errors.budgetItems[index]?.category?.message}
                      </p>
                    )}
                  </div>

                  {/* 捐赠/资助额 */}
                  <div className="space-y-2">
                    <Label className="md:hidden">捐赠/资助额（元）</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.donationAmount`, { valueAsNumber: true })}
                    />
                    {errors.budgetItems?.[index]?.donationAmount && (
                      <p className="text-sm text-destructive">
                        {errors.budgetItems[index]?.donationAmount?.message}
                      </p>
                    )}
                  </div>

                  {/* 项目自筹经费 */}
                  <div className="space-y-2">
                    <Label className="md:hidden">项目自筹经费（元）</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.selfFundedAmount`, { valueAsNumber: true })}
                    />
                    {errors.budgetItems?.[index]?.selfFundedAmount && (
                      <p className="text-sm text-destructive">
                        {errors.budgetItems[index]?.selfFundedAmount?.message}
                      </p>
                    )}
                  </div>

                  {/* 删除按钮 */}
                  <div className="flex justify-end md:justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 合计 */}
          {fields.length > 0 && (
            <div className="grid gap-4 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-center p-4 bg-muted/50 rounded-lg font-medium">
              <div className="w-12"></div>
              <div>合计</div>
              <div className="text-primary">{totalDonation.toLocaleString()} 元</div>
              <div className="text-primary">{totalSelfFund.toLocaleString()} 元</div>
              <div className="w-10"></div>
            </div>
          )}

          {fields.length > 0 && (
            <div className="space-y-2 text-right">
              <div className="text-lg font-semibold">
                总经费：<span className="text-primary">{total.toLocaleString()} 元</span>
              </div>
              <div className="text-lg font-semibold">
                申请 OPENSCI 捐赠款：<span className="text-green-600">{totalDonation.toLocaleString()} 元</span>
              </div>
            </div>
          )}
        </div>

        {errors.budgetItems && !Array.isArray(errors.budgetItems) && (
          <p className="text-sm text-destructive">{errors.budgetItems.message}</p>
        )}
      </CardContent>
    </Card>
  )
}
