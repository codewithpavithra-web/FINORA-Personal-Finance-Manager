import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useTheme } from '../context/ThemeContext'
import { User, Mail, DollarSign, Target, LogOut, Edit, Save } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Toast from '../components/Toast'

export default function Profile() {
  const { profile, updateProfile } = useFinance()
  const { theme, toggleTheme } = useTheme()

  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [toast, setToast] = useState(null)

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyIncome' ? parseFloat(value) || 0 : value
    }))
  }

  // Handle save
  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      showToast('❌ Please enter your name', 'error')
      return
    }

    if (!formData.email.trim()) {
      showToast('❌ Please enter your email', 'error')
      return
    }

    if (formData.monthlyIncome < 0) {
      showToast('❌ Monthly income cannot be negative', 'error')
      return
    }

    updateProfile(formData)
    setIsEditing(false)
    showToast('✅ Profile updated successfully!', 'success')
  }

  // Handle cancel
  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
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
          👤 Your Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <ChartCard title="📋 Personal Information" subtitle="Your account details">
        <div className="space-y-6">
          {!isEditing ? (
            <>
              {/* Display Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Currency
                  </label>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                    {profile.currency || 'INR'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Monthly Income
                  </label>
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                    ₹{profile.monthlyIncome.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Financial Goal
                </label>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                  {profile.financialGoal}
                </p>
              </div>

              {/* Edit Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Financial Goal
                </label>
                <textarea
                  name="financialGoal"
                  value={formData.financialGoal}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
                  placeholder="Describe your financial goals..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </ChartCard>

      {/* Account Summary */}
      <ChartCard title="📊 Account Summary" subtitle="Your FINORA account information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <User className="text-primary-600 dark:text-primary-400" size={20} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Aug 2024
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="text-primary-600 dark:text-primary-400" size={20} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Account Status</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              🟢 Active
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-primary-600 dark:text-primary-400" size={20} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Plan</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Free
            </p>
          </div>
        </div>
      </ChartCard>

      {/* Data & Privacy */}
      <ChartCard title="🔐 Data & Privacy" subtitle="Your data is secure and private">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-50 mb-2">🔒 Data Security</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              All your financial data is stored locally in your browser's secure storage. We never send your data to any servers. You have complete control over your data.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-50 mb-2">💾 Data Backup</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Use the Reports section to regularly backup your data. We recommend exporting your data monthly for safekeeping.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-50 mb-2">🗑️ Clear Data</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Want to start fresh? You can clear all your data from the Settings page.
            </p>
            <a
              href="/settings"
              className="inline-block px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </ChartCard>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
