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
        if (typeof window === 'undefined') return 'en'
        const stored = window.localStorage.getItem('language')
        if (stored === 'en' || stored === 'zh') return stored
        const browserLang = window.navigator.language || ''
        return browserLang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
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
