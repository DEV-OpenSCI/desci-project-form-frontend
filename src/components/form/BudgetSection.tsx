import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, HelpCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
    append({ category: '', donationAmount: 0, selfFundedAmount: 0 })
  }

  // Calculate totals
  const budgetItems = watch('budgetItems') || []
  const totalDonation = budgetItems.reduce((sum, item) => sum + (item.donationAmount || 0), 0)
  const totalSelfFund = budgetItems.reduce((sum, item) => sum + (item.selfFundedAmount || 0), 0)
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
        <div className="border-b overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[3rem_1.3fr_1fr_1fr_1fr_2.5rem] gap-4 py-3 border-b font-normal text-sm text-foreground uppercase tracking-widest items-center whitespace-nowrap">
            <div className="w-12 text-center">{t.sections.budget.tableNo}</div>
            <div>{t.sections.budget.tableCategory}</div>
            <div>{t.sections.budget.tableDonation}</div>
            <div>{t.sections.budget.tableSelfFunded}</div>
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
                  className="grid gap-4 md:grid-cols-[3rem_1.3fr_1fr_1fr_1fr_2.5rem] items-center py-4 transition-colors"
                >
                  {/* No. */}
                  <div className="hidden md:flex items-center justify-center w-12 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Budget category */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <FieldLabel className="md:hidden">{t.sections.budget.category}</FieldLabel>
                    <Select
                      value={watch(`budgetItems.${index}.category`)}
                      onValueChange={(value) => setValue(`budgetItems.${index}.category`, value)}
                    >
                      <SelectTrigger className={`w-full text-sm [&>span]:truncate ${!watch(`budgetItems.${index}.category`) ? "text-muted-foreground" : ""}`}>
                        <SelectValue placeholder={t.sections.budget.categoryPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {t.options.budgetCategories.map((item) => (
                          <SelectItem key={item.value} value={item.value} title={item.description}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.budgetItems?.[index]?.category?.message} />
                  </div>

                  {/* Donation/funding amount */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">{t.sections.budget.donation}</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.donationAmount`, { valueAsNumber: true })}
                      className="font-mono bg-transparent text-sm"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.donationAmount?.message} />
                  </div>

                  {/* Self-funded amount */}
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="md:hidden">{t.sections.budget.selfFunded}</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register(`budgetItems.${index}.selfFundedAmount`, { valueAsNumber: true })}
                      className="font-mono bg-transparent text-sm"
                    />
                    <FieldError message={errors.budgetItems?.[index]?.selfFundedAmount?.message} />
                  </div>

                  {/* Subtotal */}
                  <div className="hidden md:flex items-center justify-end md:pr-8 h-12 font-mono font-medium text-foreground text-sm">
                    {((watch(`budgetItems.${index}.donationAmount`) || 0) + (watch(`budgetItems.${index}.selfFundedAmount`) || 0)).toLocaleString()}
                  </div>

                  {/* Remove button */}
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

          {/* Total */}
          {fields.length > 0 && (
            <div className="grid gap-4 md:grid-cols-[3rem_1.3fr_1fr_1fr_1fr_2.5rem] items-center py-4 font-medium">
              <div className="w-12"></div>
              <div className="font-medium uppercase tracking-widest text-sm">{t.sections.budget.tableTotal}</div>
              <div className="text-primary font-mono font-medium text-sm">{totalDonation.toLocaleString()} {t.sections.budget.yuan}</div>
              <div className="text-primary font-mono font-medium text-sm">{totalSelfFund.toLocaleString()} {t.sections.budget.yuan}</div>
              <div className="text-right text-primary font-mono font-medium text-sm md:pr-8">{total.toLocaleString()} {t.sections.budget.yuan}</div>
              <div className="w-10"></div>
            </div>
          )}
        </div>

        {fields.length > 0 && (
          <div className="space-y-2 text-right pt-2">
            <div className="text-sm font-medium">
              {t.sections.budget.donationTotal}<span className="text-blue-700 font-mono text-sm">{totalDonation.toLocaleString()} {t.sections.budget.yuan}</span>
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
