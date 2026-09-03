import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'

const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Education',
  'Health',
  'Other',
]

const CATEGORY_EMOJIS = {
  Food: '🍚',
  Shopping: '🛍️',
  Transport: '🚌',
  Bills: '💡',
  Entertainment: '🎬',
  Education: '🎓',
  Health: '💊',
  Other: '📌',
}

export default function BudgetForm({ budget, onSubmit, onCancel, isLoading = false }) {
  const { addBudget, updateBudget } = useFinance()
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    period: 'monthly',
  })
  const [errors, setErrors] = useState({})

  // Populate form if editing
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        monthlyLimit: budget.monthlyLimit.toString(),
        period: budget.period || 'monthly',
      })
    }
  }, [budget])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.category) {
      newErrors.category = '⚠️ Please select a category.'
    }

    if (!formData.monthlyLimit) {
      newErrors.monthlyLimit = '⚠️ Monthly limit is required.'
    } else if (isNaN(parseFloat(formData.monthlyLimit)) || parseFloat(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = '⚠️ Monthly limit must be greater than ₹0.'
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
      const budgetData = {
        category: formData.category,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        period: formData.period || 'monthly',
      }

      if (budget) {
        // Update existing budget
        updateBudget(budget.id, budgetData)
        onSubmit('updated')
      } else {
        // Add new budget
        addBudget(budgetData)
        onSubmit('added')
      }
    } catch (error) {
      console.error('Error submitting budget:', error)
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

      {/* Category */}
      <div>
        <label htmlFor="category" className="form-label">
          📂 Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select a category</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_EMOJIS[cat] || '📌'} {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.category}</p>
        )}
      </div>

      {/* Budget Period */}
      <div>
        <label htmlFor="period" className="form-label">
          📅 Budget Period *
        </label>
        <select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="input-field"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <p className="form-hint">
          Budgets reset automatically at the start of each week, month, or year
        </p>
      </div>

      {/* Monthly Limit */}
      <div>
        <label htmlFor="monthlyLimit" className="form-label">
          💳 Monthly Budget Limit (₹) *
        </label>
        <input
          type="number"
          id="monthlyLimit"
          name="monthlyLimit"
          value={formData.monthlyLimit}
          onChange={handleChange}
          placeholder="5000.00"
          step="0.01"
          min="0"
          className="input-field"
        />
        <p className="form-hint">
          Set a maximum amount you want to spend in this category each month
        </p>
        {errors.monthlyLimit && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.monthlyLimit}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : budget ? '✏️ Update Budget' : '➕ Add Budget'}
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
