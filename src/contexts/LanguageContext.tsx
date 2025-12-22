import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Language = 'zh' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window === 'undefined') return 'zh'
        const stored = window.localStorage.getItem('language')
        return stored === 'en' ? 'en' : 'zh'
    })

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en')
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.localStorage.setItem('language', language)
        document.documentElement.lang = language
    }, [language])

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
