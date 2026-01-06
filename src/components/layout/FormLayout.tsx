import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FormLayoutProps {
    sidebarContent: ReactNode
    children: ReactNode
    className?: string
}

export function FormLayout({ sidebarContent, children, className }: FormLayoutProps) {
    return (
        <div className={cn('flex min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-foreground/20', className)}>
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle gradient orb */}
                <motion.div
                    className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-slate-500/15 blur-[100px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-zinc-400/15 blur-[100px]"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, -60, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Left Sidebar (Glassmorphism) */}
            <aside className="hidden lg:flex flex-col w-[320px] xl:w-[400px] h-screen fixed left-0 top-0 z-20 border-r border-border/40 bg-background/30 backdrop-blur-xl p-8 xl:p-12">
                <div className="flex-1 flex flex-col justify-center">
                    {sidebarContent}
                </div>

                {/* Footer info/copyright if needed */}
                {/* Footer info/copyright if needed - Moved to ProjectForm for flexibility  */}
                {/* <div className="text-xs text-muted-foreground/40 mt-auto">
                    © 2025 OpenSCI
                </div> */}
            </aside>

            {/* Main Content Area */}
            <main id="form-main-content" className="flex-1 lg:ml-[320px] xl:ml-[400px] relative z-10 h-screen overflow-y-auto no-scrollbar scroll-smooth">
                <div className="min-h-full flex flex-col p-6 md:p-12 lg:p-20 max-w-5xl mx-auto">
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
