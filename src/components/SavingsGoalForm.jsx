import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'

const GOAL_ICONS = ['🎯', '💻', '✈️', '🏠', '🚗', '💍', '📚', '🎮', '💪', '🎨']

export default function SavingsGoalForm({ goal, onSubmit, onCancel, isLoading = false }) {
  const { addSavingsGoal, updateSavingsGoal } = useFinance()
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    saved: '0',
    dueDate: '',
    icon: '🎯',
  })
  const [errors, setErrors] = useState({})

  // Populate form if editing
  useEffect(() => {
    if (goal) {
      const dueDate = goal.dueDate ? new Date(goal.dueDate).toISOString().split('T')[0] : ''
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount.toString(),
        saved: goal.saved.toString(),
        dueDate,
        icon: goal.icon || '🎯',
      })
    }
  }, [goal])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = '⚠️ Goal name is required.'
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = '⚠️ Target amount is required.'
    } else if (isNaN(parseFloat(formData.targetAmount)) || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = '⚠️ Target amount must be greater than ₹0.'
    }

    if (formData.saved !== '') {
      if (isNaN(parseFloat(formData.saved)) || parseFloat(formData.saved) < 0) {
        newErrors.saved = '⚠️ Saved amount must be ₹0 or greater.'
      }
      const saved = parseFloat(formData.saved)
      const target = parseFloat(formData.targetAmount)
      if (saved > target) {
        newErrors.saved = '⚠️ Saved amount cannot exceed target amount.'
      }
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = '⚠️ Due date cannot be in the past.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const goalData = {
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        saved: parseFloat(formData.saved) || 0,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        icon: formData.icon,
      }

      if (goal) {
        // Update existing goal
        updateSavingsGoal(goal.id, goalData)
        onSubmit('updated')
      } else {
        // Add new goal
        addSavingsGoal(goalData)
        onSubmit('added')
      }
    } catch (error) {
      console.error('Error submitting goal:', error)
      setErrors({ submit: 'An error occurred. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Goal Icon */}
      <div>
        <label htmlFor="icon" className="form-label">
          🎨 Goal Icon *
        </label>
        <div className="grid grid-cols-5 gap-2">
          {GOAL_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, icon }))}
              className={`p-3 rounded-lg border-2 transition-all text-2xl ${
                formData.icon === icon
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Name */}
      <div>
        <label htmlFor="title" className="form-label">
          📝 Goal Name *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., New Laptop, Vacation"
          maxLength="50"
          className="input-field"
        />
        <p className="form-hint">
          {formData.title.length}/50 characters
        </p>
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Target Amount */}
      <div>
        <label htmlFor="targetAmount" className="form-label">
          🎯 Target Amount (₹) *
        </label>
        <input
          type="number"
          id="targetAmount"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          placeholder="50000.00"
          step="0.01"
          min="0"
          className="input-field"
        />
        <p className="form-hint">
          How much do you want to save?
        </p>
        {errors.targetAmount && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.targetAmount}</p>
        )}
      </div>

      {/* Saved Amount */}
      <div>
        <label htmlFor="saved" className="form-label">
          💰 Amount Already Saved (₹)
        </label>
        <input
          type="number"
          id="saved"
          name="saved"
          value={formData.saved}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="input-field"
        />
        <p className="form-hint">
          How much have you already saved?
        </p>
        {errors.saved && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.saved}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="form-label">
          📅 Target Date (Optional)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="input-field"
        />
        <p className="form-hint">
          When do you want to reach this goal?
        </p>
        {errors.dueDate && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.dueDate}</p>
        )}
      </div>

      {/* Progress Preview */}
      {formData.targetAmount && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
            Progress Preview
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">
                ₹{parseFloat(formData.saved || 0).toLocaleString('en-IN')} / ₹{parseFloat(formData.targetAmount).toLocaleString('en-IN')}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-50">
                {Math.min(
                  Math.round((parseFloat(formData.saved || 0) / parseFloat(formData.targetAmount)) * 100),
                  100
                )}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    Math.round((parseFloat(formData.saved || 0) / parseFloat(formData.targetAmount)) * 100),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : goal ? '✏️ Update Goal' : '➕ Add Goal'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
