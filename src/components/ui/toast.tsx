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
      setTimeout(onClose, 300) // Close after the animation completes
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-chart-2" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    warning: <AlertCircle className="h-5 w-5 text-chart-3" />,
  }

  const bgColors = {
    success: 'bg-white border-foreground',
    error: 'bg-white border-foreground',
    warning: 'bg-white border-foreground',
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
          'flex items-center gap-3 px-4 py-3 rounded-lg border',
          bgColors[type]
        )}
      >
        {icons[type]}
        <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Toast container for managing multiple toasts
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
