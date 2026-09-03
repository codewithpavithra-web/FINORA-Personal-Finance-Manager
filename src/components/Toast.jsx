import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'info', duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: 'text-green-600 dark:text-green-400',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
      Icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: 'text-amber-600 dark:text-amber-400',
      Icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
      Icon: Info,
    },
  }

  const style = styles[type] || styles.info
  const { Icon, ...styleClasses } = style

  return (
    <div className="
      fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50
      animate-slide-in
      pointer-events-none
    ">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border
          ${styleClasses.bg} ${styleClasses.border} ${styleClasses.text}
          shadow-lg backdrop-blur-sm
          pointer-events-auto
          transition-all duration-200
          hover:shadow-xl
          max-w-md
        `}
      >
        <Icon size={20} className={`${styleClasses.icon} flex-shrink-0`} />
        <p className="text-sm font-medium flex-1 text-left">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="
            ml-2 p-1 hover:opacity-70
            transition-opacity duration-200
            flex-shrink-0 touch-target
            focus-visible:ring-2 focus-visible:ring-offset-2
          "
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
