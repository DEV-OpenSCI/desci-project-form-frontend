import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getFillCode, setFillCode as saveFillCode, clearFillCode, getExpireTime, setExpireTime as saveExpireTime } from '@/lib/auth'
import { validateFillCode } from '@/services/fillCodeApi'
import { useTranslation } from '@/i18n'

interface FillCodeContextType {
  fillCode: string | null
  isValidating: boolean
  error: string | null
  expireTime: string | null
  validateAndSet: (code: string) => Promise<boolean>
  clear: () => void
}

const FillCodeContext = createContext<FillCodeContextType | undefined>(
  undefined
)

export function FillCodeProvider({ children }: { children: ReactNode }) {
  const [fillCode, setFillCode] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expireTime, setExpireTime] = useState<string | null>(null)
  const { t, language } = useTranslation()


  // 初始化时从 sessionStorage 恢复填写码
  useEffect(() => {
    const savedCode = getFillCode()
    const savedExpireTime = getExpireTime()
    console.log('[FillCodeContext] Init:', { savedCode, savedExpireTime })

    if (savedCode) {
      setFillCode(savedCode)
    }
    if (savedExpireTime) {
      setExpireTime(savedExpireTime)
    }
  }, [])

  const validateAndSet = async (code: string): Promise<boolean> => {
    setIsValidating(true)
    setError(null)

    // 快捷通道：输入 "nocode" 直接进入
    if (code.toLowerCase() === 'nocode') {
      setFillCode(code)
      saveFillCode(code)
      setIsValidating(false)
      return true
    }

    try {
      const result = await validateFillCode(code)
      console.log('[FillCodeContext] Validate result:', result)

      if (result.valid) {
        // 填写码有效
        setFillCode(code)
        saveFillCode(code)
        setExpireTime(result.expireTime)
        if (result.expireTime) {
          saveExpireTime(result.expireTime)
          console.log('[FillCodeContext] Saved expire time:', result.expireTime)
        }
        return true
      } else {
        // 填写码无效
        const fallbackMessage = t.messages.fillCodeInvalid
        const message = language === 'en' ? fallbackMessage : (result.message || fallbackMessage)
        setError(message)
        return false
      }
    } catch (err) {
      setError(t.messages.fillCodeValidateFailed)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const clear = () => {
    setFillCode(null)
    setExpireTime(null)
    setError(null)
    clearFillCode()
  }

  return (
    <FillCodeContext.Provider
      value={{
        fillCode,
        isValidating,
        error,
        expireTime,
        validateAndSet,
        clear,
      }}
    >
      {children}
    </FillCodeContext.Provider>
  )
}

export function useFillCode() {
  const context = useContext(FillCodeContext)
  if (context === undefined) {
    throw new Error('useFillCode must be used within FillCodeProvider')
  }
  return context
}
