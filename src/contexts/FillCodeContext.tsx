import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getFillCode, setFillCode as saveFillCode, clearFillCode } from '@/lib/auth'
import { validateFillCode } from '@/services/fillCodeApi'

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

  // 初始化时从 sessionStorage 恢复填写码
  useEffect(() => {
    const savedCode = getFillCode()
    if (savedCode) {
      setFillCode(savedCode)
    }
  }, [])

  const validateAndSet = async (code: string): Promise<boolean> => {
    setIsValidating(true)
    setError(null)

    try {
      const result = await validateFillCode(code)

      if (result.valid) {
        // 填写码有效
        setFillCode(code)
        saveFillCode(code)
        setExpireTime(result.expireTime)
        return true
      } else {
        // 填写码无效
        setError(result.message || '填写码无效')
        return false
      }
    } catch (err) {
      setError('校验失败，请稍后重试')
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
