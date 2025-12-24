import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage()

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2 font-mono font-bold"
        >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'EN' : 'ZH'}
        </Button>
    )
}
