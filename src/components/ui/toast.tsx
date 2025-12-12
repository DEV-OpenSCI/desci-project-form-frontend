import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning'
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'error', duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // 等待动画完成后关闭
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full px-4',
        'transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
          bgColors[type]
        )}
      >
        {icons[type]}
        <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Toast 容器，用于管理多个 toast
interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'warning'
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${1 + index * 4.5}rem` }} className="fixed left-1/2 -translate-x-1/2 z-[100] max-w-md w-full px-4">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  )

  return { showToast, ToastContainer }
}
