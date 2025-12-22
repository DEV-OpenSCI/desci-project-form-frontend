import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { BUDGET_CATEGORIES } from '@/lib/constants'

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
    <FormSection title="项目经费" description="研究人员提交经费列表，总额作为捐赠/资助的软顶目标">
      {/* 经费类别说明 */}
      <div className="grid gap-8 md:grid-cols-2">
        {BUDGET_CATEGORIES.map((item) => (
          <div
            key={item.value}
            className="group flex flex-col gap-4 p-6 bg-card hover:bg-muted/50 border border-border/60 hover:border-primary/20 rounded-lg transition-all duration-300"
          >
            <div className="font-bold text-base text-primary/90 group-hover:text-primary transition-colors">
              {item.label}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* 经费列表 */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">经费明细</h3>
          <Button type="button" variant="outline" size="sm" onClick={addBudgetItem} className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            添加经费项
          </Button>
        </div>

        {/* 表头 */}
        <div className="border-b overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-8 px-4 py-3 border-b font-bold text-sm text-muted-foreground uppercase tracking-widest">
            <div className="w-12 text-center">NO.</div>
            <div>Category</div>
            <div>Donation (CNY)</div>
            <div>Self-Funded (CNY)</div>
            <div className="w-10"></div>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无经费项，点击上方按钮添加
            </div>
          ) : (
            <div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-8 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-center p-4 transition-colors"
                >
                  {/* 序号 */}
                  <div className="hidden md:flex items-center justify-center w-12 h-9 bg-muted rounded-full font-medium font-mono text-sm">
                    {index + 1}
                  </div>

                  {/* 经费类别 */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">经费类别</FieldLabel>
                    <Select
                      value={watch(`budgetItems.${index}.category`)}
                      onValueChange={(value) => setValue(`budgetItems.${index}.category`, value)}
                    >
                      <SelectTrigger className={!watch(`budgetItems.${index}.category`) ? "text-muted-foreground" : ""}>
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
                    <FieldError message={errors.budgetItems?.[index]?.category?.message} />
                  </div>

                  {/* 捐赠/资助额 */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">捐赠/资助额（元）</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.donationAmount`, { valueAsNumber: true })}
                      className="font-mono bg-transparent"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.donationAmount?.message} />
                  </div>

                  {/* 项目自筹经费 */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">项目自筹经费（元）</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.selfFundedAmount`, { valueAsNumber: true })}
                      className="font-mono bg-transparent"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.selfFundedAmount?.message} />
                  </div>

                  {/* 删除按钮 */}
                  <div className="flex justify-end md:justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive rounded-full hover:bg-destructive/10"
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
            <div className="grid gap-8 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-center p-4 font-medium">
              <div className="w-12"></div>
              <div className="font-bold uppercase tracking-widest text-sm">Total</div>
              <div className="text-primary font-mono font-bold">{totalDonation.toLocaleString()} 元</div>
              <div className="text-primary font-mono font-bold">{totalSelfFund.toLocaleString()} 元</div>
              <div className="w-10"></div>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <div className="space-y-2 text-right pt-4">
            <div className="text-lg font-semibold">
              总经费：<span className="text-primary font-mono text-xl">{total.toLocaleString()} 元</span>
            </div>
            <div className="text-lg font-semibold">
              申请 OPENSCI 捐赠款：<span className="text-blue-700 font-mono text-xl">{totalDonation.toLocaleString()} 元</span>
            </div>
          </div>
        )}
      </div>

      {errors.budgetItems && !Array.isArray(errors.budgetItems) && (
        <FieldError message={errors.budgetItems.message as string} />
      )}
    </FormSection>
  )
}
