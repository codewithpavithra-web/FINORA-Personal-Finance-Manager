import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Close modal on Escape key and manage focus
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      // Prevent body scroll and store previous overflow value
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)

      // Focus close button for keyboard users
      if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = previousOverflow
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ease-out animate-fade-in"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={modalRef}
          className={`
            bg-white dark:bg-slate-800
            rounded-2xl shadow-2xl
            border border-slate-200 dark:border-slate-700
            w-full ${sizeClasses[size]}
            max-h-[95vh] sm:max-h-[90vh]
            overflow-y-auto
            animate-slide-in
            transition-all duration-200
            flex flex-col
          `}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          {/* Header - Sticky */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 bg-white dark:bg-slate-800 z-10">
            <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 flex-1 pr-4">
              {title}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="
                p-2 hover:bg-slate-100 dark:hover:bg-slate-700
                rounded-lg transition-colors duration-150
                flex-shrink-0 touch-target
                focus-visible:ring-2 focus-visible:ring-primary-500
              "
              aria-label="Close dialog"
            >
              <X size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
