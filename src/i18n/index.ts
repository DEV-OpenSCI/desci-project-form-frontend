import { useLanguage } from '@/contexts/LanguageContext'
import { zh } from './zh'
import { en } from './en'

const translations = { zh, en }

export function useTranslation() {
    const { language } = useLanguage()

    const t = translations[language]

    return { t, language }
}

export type Translations = typeof zh
