import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import DotGrid from '@/components/ui/DotGrid'

interface FormLayoutProps {
    sidebarContent: ReactNode
    children: ReactNode
    className?: string
}

export function FormLayout({ sidebarContent, children, className }: FormLayoutProps) {
    return (
        <div className={cn('flex min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-foreground/20', className)}>
            {/* Left Sidebar (Glassmorphism) */}
            <aside className="hidden lg:flex flex-col w-[320px] xl:w-[400px] h-screen fixed left-0 top-0 z-20 border-r border-border/40 bg-zinc-200/40 backdrop-blur-xl p-8 xl:p-12">
                <div className="flex-1 flex flex-col justify-center">
                    {sidebarContent}
                </div>
            </aside>

            {/* Main Content Area */}
            <main id="form-main-content" className="flex-1 lg:ml-[320px] xl:ml-[400px] relative z-10 h-screen overflow-y-auto no-scrollbar scroll-smooth">
                {/* DotGrid Background - Fixed at bottom */}
                <div className="fixed bottom-0 left-0 lg:left-[320px] xl:left-[400px] right-0 h-[50vh] pointer-events-none z-0 opacity-50">
                    <DotGrid
                        dotSize={2}
                        gap={24}
                        baseColor="#d4d4d4"
                        activeColor="#888888"
                        proximity={120}
                    />
                </div>

                <div className="min-h-full flex flex-col p-6 md:p-12 lg:p-20 max-w-5xl mx-auto relative z-10">
                    {/* Mobile Header Placeholder (if needed for sidebar content on mobile) */}
                    <div className="lg:hidden mb-8">
                        {/* Mobile navigation or stepper usually goes here, but we might inject it from parent */}
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
