import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Delete Transaction',
  message = 'Are you sure you want to delete this transaction? This action cannot be undone.',
  isLoading = false,
}) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg-soft border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 text-center mb-2">
              {title}
            </h2>

            {/* Message */}
            <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
