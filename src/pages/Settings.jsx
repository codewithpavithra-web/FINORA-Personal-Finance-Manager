import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun, Trash2, Info, AlertCircle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Settings() {
  const { clearAllData } = useFinance()
  const { theme, toggleTheme } = useTheme()

  // Modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Toast state
  const [toast, setToast] = useState(null)

  const handleClearData = () => {
    try {
      clearAllData()
      setShowClearConfirm(false)
      showToast('✅ All data cleared successfully. The page will refresh.', 'success')
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      showToast('❌ Error clearing data. Please try again.', 'error')
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          ⚙️ Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your app preferences and account settings
        </p>
      </div>

      {/* Appearance Settings */}
      <ChartCard title="🎨 Appearance" subtitle="Customize how FINORA looks">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="text-yellow-500" size={24} />
                ) : (
                  <Moon className="text-indigo-500" size={24} />
                )}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                    Theme Mode
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Currently using <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong> mode
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your theme preference is saved automatically. Switch between light and dark modes at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Data & Privacy */}
      <ChartCard title="🔐 Data & Privacy" subtitle="Manage your data">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  🔒 Data Storage
                </h3>
              </div>
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                Secure
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              All your data is stored locally on your device. We don't store anything on our servers.
            </p>
            <a
              href="/reports"
              className="inline-block px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition-colors"
            >
              Go to Reports & Backup
            </a>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
              📋 What We Collect
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ Transactions (income, expenses)</li>
              <li>✓ Budgets and spending limits</li>
              <li>✓ Savings goals</li>
              <li>✓ Profile information</li>
              <li>✗ We don't collect: location, browsing history, device info</li>
            </ul>
          </div>
        </div>
      </ChartCard>

      {/* App Information */}
      <ChartCard title="ℹ️ About FINORA" subtitle="App information">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">App Name</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">FINORA</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Version</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Build</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">Phase 8</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">Status</span>
            <span className="font-semibold text-slate-900 dark:text-slate-50">🟢 Active</span>
          </div>
        </div>
      </ChartCard>

      {/* Dangerous Actions */}
      <ChartCard title="⚠️ Dangerous Zone" subtitle="Irreversible actions">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-50 mb-2">
                  🗑️ Clear All Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  This will permanently delete all your transactions, budgets, savings goals, and profile information from FINORA. <strong>This action cannot be undone.</strong>
                </p>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Trash2 size={18} />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h3 className="font-semibold text-amber-900 dark:text-amber-50 mb-2">
              💡 Before you clear data
            </h3>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>✓ Export your data from Reports page</li>
              <li>✓ Save the backup file to your computer</li>
              <li>✓ You can restore data later by importing the backup</li>
            </ul>
          </div>
        </div>
      </ChartCard>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <Modal
          title="⚠️ Clear All Data?"
          onClose={() => setShowClearConfirm(false)}
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-50">
                    This action is permanent and cannot be undone
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    All your financial data will be permanently deleted. You will lose:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1 ml-4">
                    <li>• All transactions (income & expenses)</li>
                    <li>• All budgets and spending limits</li>
                    <li>• All savings goals</li>
                    <li>• Profile information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Yes, Clear All Data
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
