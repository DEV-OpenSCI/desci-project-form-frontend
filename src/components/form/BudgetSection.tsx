import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItemWithTooltip,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { FieldLabel } from '@/components/form/FieldLabel'
import { FieldError } from '@/components/form/FieldError'
import { FormSection } from '@/components/form/FormSection'
import type { ProjectFormData } from '@/types/form'
import { useTranslation } from '@/i18n'

interface BudgetSectionProps {
  form: UseFormReturn<ProjectFormData>
}

export function BudgetSection({ form }: BudgetSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form
  const { t } = useTranslation()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'budgetItems',
  })

  const addBudgetItem = () => {
    append({ category: '', donationAmount: '' as any, selfFundedAmount: '' as any })
  }

  // Calculate totals
  const budgetItems = watch('budgetItems') || []
  const totalDonation = budgetItems.reduce((sum, item) => sum + (Number(item.donationAmount) || 0), 0)
  const totalSelfFund = budgetItems.reduce((sum, item) => sum + (Number(item.selfFundedAmount) || 0), 0)
  const total = totalDonation + totalSelfFund

  return (
    <FormSection title={t.sections.budget.title} description={t.sections.budget.description}>

      {/* Budget list */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t.sections.budget.details}</h3>
          <Button type="button" variant="outline" size="sm" onClick={addBudgetItem} className="rounded-full text-sm">
            <Plus className="h-4 w-4 mr-1" />
            {t.sections.budget.addItem}
          </Button>
        </div>

        {/* Table header */}
        <div className="border-b overflow-x-auto">
          <div className="hidden md:grid md:grid-cols-[3rem_minmax(160px,200px)_minmax(120px,160px)_minmax(120px,160px)_minmax(80px,120px)_3rem] gap-4 py-3 border-b font-normal text-sm text-foreground uppercase tracking-widest items-center whitespace-nowrap">
            <div className="w-12 text-center">{t.sections.budget.tableNo}</div>
            <div className="text-left">{t.sections.budget.tableCategory}</div>
            <div className="text-left">{t.sections.budget.tableDonation}</div>
            <div className="text-left">{t.sections.budget.tableSelfFunded}</div>
            <div className="text-right pr-8">{t.sections.budget.tableSubtotal}</div>
            <div className="w-10"></div>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t.sections.budget.noItems}
            </div>
          ) : (
            <div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 md:grid-cols-[3rem_minmax(160px,200px)_minmax(120px,160px)_minmax(120px,160px)_minmax(80px,120px)_3rem] items-start py-4 transition-colors relative"
                >
                  {/* No. */}
                  <div className="hidden md:flex items-center justify-center w-12 h-10 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Budget category */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <FieldLabel className="md:hidden">{t.sections.budget.category}</FieldLabel>
                    <Select
                      value={watch(`budgetItems.${index}.category`)}
                      onValueChange={(value) => setValue(`budgetItems.${index}.category`, value, { shouldValidate: true })}
                    >
                      <SelectTrigger className={`w-full text-sm h-10 [&>span]:truncate ${!watch(`budgetItems.${index}.category`) ? "text-muted-foreground" : ""}`}>
                        <SelectValue placeholder={t.sections.budget.categoryPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {t.options.budgetCategories.map((item) => (
                          <SelectItemWithTooltip key={item.value} value={item.value} description={item.description}>
                            {item.label}
                          </SelectItemWithTooltip>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.budgetItems?.[index]?.category?.message} />
                  </div>

                  {/* Donation/funding amount */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">{t.sections.budget.donation}</FieldLabel>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      {...register(`budgetItems.${index}.donationAmount`, { valueAsNumber: true })}
                      onFocus={(e) => e.target.select()}
                      className="font-mono bg-transparent text-sm h-10"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.donationAmount?.message} />
                  </div>

                  {/* Self-funded amount */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">{t.sections.budget.selfFunded}</FieldLabel>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      {...register(`budgetItems.${index}.selfFundedAmount`, { valueAsNumber: true })}
                      onFocus={(e) => e.target.select()}
                      className="font-mono bg-transparent text-sm h-10"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.selfFundedAmount?.message} />
                  </div>

                  {/* Subtotal */}
                  <div className="hidden md:flex items-center justify-end md:pr-8 h-10 font-mono font-medium text-foreground text-sm">
                    {t.sections.budget.yuan} {((Number(watch(`budgetItems.${index}.donationAmount`)) || 0) + (Number(watch(`budgetItems.${index}.selfFundedAmount`)) || 0)).toLocaleString()}
                  </div>

                  {/* Remove button */}
                  <div className="flex justify-end md:justify-center h-10 items-center">
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

          {/* Total */}
          {fields.length > 0 && (
            <div className="grid gap-4 md:grid-cols-[3rem_minmax(160px,200px)_minmax(120px,160px)_minmax(120px,160px)_minmax(80px,120px)_3rem] items-center py-4 font-medium">
              <div className="w-12"></div>
              <div className="font-medium uppercase tracking-widest text-sm">{t.sections.budget.tableTotal}</div>
              <div className="text-primary font-mono font-medium text-sm">{t.sections.budget.yuan} {totalDonation.toLocaleString()}</div>
              <div className="text-primary font-mono font-medium text-sm">{t.sections.budget.yuan} {totalSelfFund.toLocaleString()}</div>
              <div className="text-right text-primary font-mono font-medium text-sm md:pr-8">{t.sections.budget.yuan} {total.toLocaleString()}</div>
              <div className="w-10"></div>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <div className="space-y-2 text-right pt-2">
            <div className="text-sm font-medium">
              {t.sections.budget.donationTotal}<span className="text-blue-700 font-mono text-sm">{t.sections.budget.yuan} {totalDonation.toLocaleString()}</span>
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
