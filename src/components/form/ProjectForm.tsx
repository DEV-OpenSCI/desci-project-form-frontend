import { useState, useEffect, useCallback } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/components/ui/toast'
import { BasicInfoSection } from './BasicInfoSection'
import { TeamSection } from './TeamSection'
import { ProjectIntroSection } from './ProjectIntroSection'
import { BudgetSection } from './BudgetSection'
import { ContactSection } from './ContactSection'
import { SubmissionSuccess } from '@/components/form/SubmissionSuccess'
import { VerticalStepper } from './VerticalStepper' // [NEW] Left Sidebar Stepper
import { StepNavigation } from './StepNavigation'
import { AnimatePresence } from 'framer-motion' // [NEW] Motion
import { MotionPage } from './MotionPage' // [NEW] Page Transition Wrapper
import { FormLayout } from '@/components/layout/FormLayout' // [NEW] Layout Wrapper
import { BrandMark } from '@/components/layout/BrandMark' // [NEW] For Sidebar
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher' // [NEW] For Sidebar
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { createProjectFormSchema, type ProjectFormData } from '@/types/form'
import { submitApplication } from '@/services/formApi'
import { useFillCode } from '@/contexts/FillCodeContext'
import { useTranslation } from '@/i18n'

// Form step definitions
const FORM_STEPS = [
  { key: 'basicInfo', labelKey: 'basicInfo' },
  { key: 'team', labelKey: 'team' },
  { key: 'projectIntro', labelKey: 'projectIntro' },
  { key: 'budget', labelKey: 'budget' },
  { key: 'contact', labelKey: 'contact' },
]

// Mock data for test mode
function getMockFormData(): ProjectFormData {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear() + 2, now.getMonth(), 0)

  // Milestone timing (roughly 8 months per phase)
  const phase1Start = new Date(startDate)
  const phase1End = new Date(startDate.getFullYear(), startDate.getMonth() + 8, 0)
  const phase2Start = new Date(phase1End.getFullYear(), phase1End.getMonth() + 1, 1)
  const phase2End = new Date(phase2Start.getFullYear(), phase2Start.getMonth() + 8, 0)
  const phase3Start = new Date(phase2End.getFullYear(), phase2End.getMonth() + 1, 1)
  const phase3End = new Date(endDate)

  return {
    projectName: 'Decentralized Research Data Sharing Platform',
    startDate,
    endDate,
    discipline: 'engineering',
    field: 'materials',
    teamSize: 5,
    leader: {
      name: 'Alex Chen',
      orcid: '0000-0002-1234-5678',
      email: 'alex.chen@example.edu.cn',
      title: 'professor',
      education: 'phd',
      bio: 'Focused on distributed systems and blockchain research, with multiple publications and project leadership.',
    },
    members: [
      { role: 'key-member', resumeS3Key: '' },
      { role: 'other-member', resumeS3Key: '' },
    ],
    projectSummary: 'Research data sharing faces challenges such as lack of trust, weak incentives, and privacy risks. This project proposes a decentralized platform with smart contracts for data ownership, access control, and contribution incentives.',
    background: 'Research data is increasingly strategic, yet centralized sharing models suffer from silos and weak data protection. Decentralized systems can improve transparency, traceability, and collaboration efficiency.',
    milestones: [
      {
        stage: 'early',
        startDate: phase1Start,
        endDate: phase1End,
        content: 'Finalize system architecture and core module development',
        goals: 'Complete requirements analysis and system design\nSelect and integrate a blockchain framework\nDevelop data ownership smart contracts',
      },
      {
        stage: 'mid',
        startDate: phase2Start,
        endDate: phase2End,
        content: 'Deliver main platform features and testing',
        goals: 'Implement data sharing and access control modules\nDeliver contribution incentive mechanism\nSubmit 2 conference papers',
      },
      {
        stage: 'late',
        startDate: phase3Start,
        endDate: phase3End,
        content: 'Complete integration testing and pilot deployment',
        goals: 'Optimize performance and conduct security audit\nRun pilots across 3+ research institutions\nFile 2 patent applications',
      },
    ],
    budgetItems: [
      { category: 'equipment', donationAmount: 50000, selfFundedAmount: 20000 },
      { category: 'materials', donationAmount: 30000, selfFundedAmount: 10000 },
      { category: 'testing', donationAmount: 20000, selfFundedAmount: 5000 },
      { category: 'travel', donationAmount: 15000, selfFundedAmount: 5000 },
      { category: 'conference', donationAmount: 10000, selfFundedAmount: 5000 },
      { category: 'publication', donationAmount: 8000, selfFundedAmount: 2000 },
      { category: 'labor', donationAmount: 60000, selfFundedAmount: 20000 },
    ],
    contact: {
      name: 'Jamie Lee',
      email: 'jamie.lee@example.edu.cn',
      phone: '13800138000',
    },
  }
}

const REDIRECT_COUNTDOWN = 10 // Countdown seconds

// Get the first errored field name (supports nesting)
function getFirstErrorFieldName(errors: FieldErrors<ProjectFormData>): string | null {
  const fieldOrder = [
    'projectName', 'startDate', 'endDate', 'discipline', 'field', 'teamSize',
    'leader.name', 'leader.email', 'leader.title', 'leader.education',
    'members',
    'projectSummary', 'background',
    'milestones',
    'budgetItems',
    'contact.name', 'contact.email', 'contact.phone',
  ]

  for (const field of fieldOrder) {
    const parts = field.split('.')
    let error: unknown = errors
    for (const part of parts) {
      error = (error as Record<string, unknown>)?.[part]
    }
    if (error) {
      return field
    }
  }

  // Check array fields
  if (errors.milestones) {
    for (let i = 0; i < 3; i++) {
      const milestoneErrors = errors.milestones[i]
      if (milestoneErrors) {
        const fields = ['startDate', 'endDate', 'content', 'goals']
        for (const f of fields) {
          if ((milestoneErrors as Record<string, unknown>)[f]) {
            return `milestones.${i}.${f}`
          }
        }
      }
    }
  }

  return null
}

// Scroll to the errored field
function scrollToErrorField(fieldName: string) {
  // Try to find by name attribute
  let element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement

  // If not found, try id (some components like Select use id)
  if (!element) {
    const idFieldName = fieldName.replace(/\./g, '-')
    element = document.getElementById(idFieldName) as HTMLElement
  }

  // If still not found, try related labels
  if (!element) {
    const labels = document.querySelectorAll('label')
    for (const label of labels) {
      if (label.htmlFor?.includes(fieldName.split('.').pop() || '')) {
        element = label as HTMLElement
        break
      }
    }
  }

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Try to focus the element
    setTimeout(() => {
      if (element && 'focus' in element) {
        (element as HTMLInputElement).focus?.()
      }
    }, 500)
  }
}

export function ProjectForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [applicationNo, setApplicationNo] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN)
  const { clear: clearFillCode } = useFillCode()
  const { showToast, ToastContainer } = useToast()
  const { t } = useTranslation()

  // Step navigation handlers
  // Define fields to validate for each step
  const getStepFields = (step: number): any[] => {
    switch (step) {
      case 0: return ['projectName', 'startDate', 'endDate', 'discipline', 'field', 'teamSize']
      case 1: return ['leader.name', 'leader.email', 'leader.title', 'leader.education', 'members'] // leader fields + members array
      case 2: return ['projectSummary', 'background', 'milestones']
      case 3: return ['budgetItems']
      case 4: return ['contact.name', 'contact.email', 'contact.phone']
      default: return []
    }
  }

  // Step navigation handlers
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleNextStep = async () => {
    setIsValidating(true)
    const fields = getStepFields(currentStep)
    const isValid = await form.trigger(fields as any)
    setIsValidating(false)

    if (isValid) {
      setCurrentStep((prev) => Math.min(FORM_STEPS.length - 1, prev + 1))
    }
  }

  const handleStepClick = async (index: number) => {
    // Allow going back always
    if (index < currentStep) {
      setCurrentStep(index)
      return
    }

    // If clicking next step, validate current
    if (index === currentStep + 1) {
      setIsValidating(true)
      const fields = getStepFields(currentStep)
      const isValid = await form.trigger(fields as any)
      setIsValidating(false)
      if (isValid) {
        setCurrentStep(index)
      }
      return
    }

    // Do not allow jumping ahead more than 1 step
  }

  // Check if test mode is enabled
  const isTestMode = new URLSearchParams(window.location.search).get('test') === 'true'

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      projectName: '',
      discipline: '',
      field: '',
      teamSize: 1,
      leader: {
        name: '',
        orcid: '',
        email: '',
        title: '',
        education: '',
        bio: '',
      },
      members: [],
      projectSummary: '',
      background: '',
      milestones: t.options.milestoneStages.map((stage) => ({
        stage: stage.value,
        startDate: undefined as unknown as Date,
        endDate: undefined as unknown as Date,
        content: '',
        goals: '',
      })),
      budgetItems: [],
      contact: {
        name: '',
        email: '',
        phone: '',
      },
    },
  })

  // Auto-fill mock data in test mode
  useEffect(() => {
    if (isTestMode) {
      const mockData = getMockFormData()
      form.reset(mockData)
    }
  }, [isTestMode, form])

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const appNo = await submitApplication(data)
      setApplicationNo(appNo)
      setCountdown(REDIRECT_COUNTDOWN) // Reset countdown
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : t.messages.submitFailed
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle validation failure
  const onInvalid = useCallback((errors: FieldErrors<ProjectFormData>) => {
    // Count validation errors
    let errorCount = 0
    const countErrors = (obj: unknown): number => {
      if (!obj || typeof obj !== 'object') return 0
      let count = 0
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object' && 'message' in value) {
          count++
        } else if (Array.isArray(value)) {
          for (const item of value) {
            count += countErrors(item)
          }
        } else if (typeof value === 'object') {
          count += countErrors(value)
        }
      }
      return count
    }
    errorCount = countErrors(errors)

    // Show toast notification
    showToast(
      t.messages.formMissingRequired.replace('{count}', `${errorCount}`),
      'warning'
    )

    // Scroll to the first errored field
    const firstErrorField = getFirstErrorFieldName(errors)
    if (firstErrorField) {
      setTimeout(() => scrollToErrorField(firstErrorField), 100)
    }
  }, [showToast, t])

  // Auto-scroll to top when step changes
  useEffect(() => {
    const mainContent = document.getElementById('form-main-content')
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  // Countdown logic after successful submission
  useEffect(() => {
    if (!applicationNo) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          clearFillCode() // Clear code after countdown and return home
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [applicationNo, clearFillCode])

  // Show success page after submission (kept as is or wrapped in motion)
  if (applicationNo) {
    return (
      <SubmissionSuccess
        applicationNo={applicationNo}
        countdown={countdown}
        onPrint={() => window.print()}
        onReturn={clearFillCode}
      />
    )
  }

  // Sidebar content including Logo, Stepper, and User Controls
  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="mb-8 pt-4">
        <BrandMark size="md" />
      </div>

      <div className="flex-1">
        <VerticalStepper
          steps={FORM_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="pt-8 border-t border-border/10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFillCode}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2 h-8 px-2"
          >
            <LogOut size={16} />
            <span className="font-mono text-xs font-medium tracking-wider">LOG OUT</span>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground/40 font-mono">
          © 2025 OpenSCI
        </div>
      </div>
    </div>
  )

  return (
    <>
      <ToastContainer />
      <FormLayout sidebarContent={sidebarContent}>
        {/* Mobile Stepper Support (optional, for small screens) */}
        <div className="lg:hidden mb-8">
          <VerticalStepper
            steps={FORM_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            className="flex-row overflow-x-auto max-w-full pb-2"
          />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="w-full max-w-3xl mx-auto flex flex-col relative min-h-[500px]">
          {/* Card Stack Container - Grid for overlapping */}
          <div className="flex-1 grid grid-cols-1 grid-rows-1 isolate w-full">
            <AnimatePresence mode="popLayout" custom={currentStep}>
              {currentStep === 0 && (
                <MotionPage key="basicInfo" className="col-start-1 row-start-1 h-fit bg-red-500/0" custom={currentStep}>
                  <BasicInfoSection form={form} />
                </MotionPage>
              )}
              {currentStep === 1 && (
                <MotionPage key="team" className="col-start-1 row-start-1 h-fit" custom={currentStep}>
                  <TeamSection form={form} />
                </MotionPage>
              )}
              {currentStep === 2 && (
                <MotionPage key="projectIntro" className="col-start-1 row-start-1 h-fit" custom={currentStep}>
                  <ProjectIntroSection form={form} />
                </MotionPage>
              )}
              {currentStep === 3 && (
                <MotionPage key="budget" className="col-start-1 row-start-1 h-fit" custom={currentStep}>
                  <BudgetSection form={form} />
                </MotionPage>
              )}
              {currentStep === 4 && (
                <MotionPage key="contact" className="col-start-1 row-start-1 h-fit" custom={currentStep}>
                  <ContactSection form={form} />
                </MotionPage>
              )}
            </AnimatePresence>
          </div>

          {/* Error prompt */}
          {submitError && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-sm mt-6">
              {submitError}
            </div>
          )}

          {/* Step navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            isSubmitting={isSubmitting}
            isValidating={isValidating}
            className="mt-12"
          />
        </form>
      </FormLayout>
    </>
  )
}
