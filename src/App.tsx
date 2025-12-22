import { FillCodeProvider, useFillCode } from '@/contexts/FillCodeContext'
import { FillCodeForm } from '@/components/FillCodeForm'
import { ProjectForm } from '@/components/form/ProjectForm'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { HeroSection } from '@/components/layout/HeroSection'
import { PageLayout } from '@/components/layout/PageLayout'




function AppContent() {
  const { fillCode, expireTime, clear } = useFillCode()

  // 如果没有填写码，显示填写码输入页面
  if (!fillCode) {
    return <FillCodeForm />
  }

  // 有填写码，显示项目申请表单
  return (
    <PageLayout
      header={<HeaderBar code={fillCode} onChange={clear} />}
      hero={
        <HeroSection
          title="Project Application"
          description={
            <>
              Please fill out the information below to complete your project application. Fields marked with{' '}
              <span className="text-destructive font-bold">*</span> are required.
            </>
          }
          expireTime={expireTime ?? undefined}
        />
      }
    >
      <ProjectForm />
    </PageLayout>
  )
}

function App() {
  return (
    <FillCodeProvider>
      <AppContent />
    </FillCodeProvider>
  )
}

export default App
