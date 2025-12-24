import { FillCodeProvider, useFillCode } from '@/contexts/FillCodeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { FillCodeForm } from '@/components/FillCodeForm'
import { ProjectForm } from '@/components/form/ProjectForm'
import { HeaderBar } from '@/components/layout/HeaderBar'
import { HeroSection } from '@/components/layout/HeroSection'
import { PageLayout } from '@/components/layout/PageLayout'
import DotGrid from '@/components/ui/DotGrid'




function AppContent() {
  const { fillCode, clear } = useFillCode()

  // Show fill-code input when no code is present
  if (!fillCode) {
    return (
      <>
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#d4d4d4"
          activeColor="#737373"
          proximity={100}
        />
        <FillCodeForm />
      </>
    )
  }

  // Show the application form when a code is present
  return (
    <>
      <DotGrid
        dotSize={3}
        gap={24}
        baseColor="#d4d4d4"
        activeColor="#737373"
        proximity={100}
      />
      <PageLayout
        header={<HeaderBar code={fillCode} onChange={clear} />}
        hero={<HeroSection />}
      >
        <ProjectForm />
      </PageLayout>
    </>
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
