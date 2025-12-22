import { FillCodeProvider, useFillCode } from '@/contexts/FillCodeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { FillCodeForm } from '@/components/FillCodeForm'
import { ProjectForm } from '@/components/form/ProjectForm'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { HeroSection } from '@/components/layout/HeroSection'
import { PageLayout } from '@/components/layout/PageLayout'




function AppContent() {
  const { fillCode, clear } = useFillCode()

  // 如果没有填写码，显示填写码输入页面
  if (!fillCode) {
    return <FillCodeForm />
  }

  // 有填写码，显示项目申请表单
  return (
    <PageLayout
      header={<HeaderBar code={fillCode} onChange={clear} />}
      hero={<HeroSection />}
    >
      <ProjectForm />
    </PageLayout>
  )
}

function App() {
  return (
    <LanguageProvider>
      <FillCodeProvider>
        <AppContent />
      </FillCodeProvider>
    </LanguageProvider>
  )
}

export default App
