import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MotionPageProps {
    children: ReactNode
    className?: string
    key?: string | number
    custom?: any
}

const pageVariants = {
    initial: {
        opacity: 0,
        x: '20%', // Slide in from right (just a bit to avoid long travel)
        y: 0,
        scale: 1,
        filter: 'blur(4px)',
        zIndex: 10,
    },
    enter: {
        opacity: 1,
        x: '0%',
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        zIndex: 5,
        transition: {
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        x: '-10%', // Move slightly left
        filter: 'blur(4px)',
        zIndex: 0,
        transition: {
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
        },
    },
}

export function MotionPage({ children, className, ...props }: MotionPageProps) {
    return (
        <motion.div
            variants={pageVariants as any}
            initial="initial"
            animate="enter"
            exit="exit"
            className={cn('w-full', className)}
            {...props}
        >
            {children}
        </motion.div>
    )
}
