import { useState, useEffect } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import TypeSelector from './TypeSelector'
import CategoryPicker from './CategoryPicker'

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other']
const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Education', 'Health', 'Other']
const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer']

const CATEGORY_EMOJIS = {
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Bonus: '🎁',
  Gift: '🎀',
  Food: '🍚',
  Shopping: '🛍️',
  Transport: '🚌',
  Bills: '💡',
  Entertainment: '🎬',
  Education: '🎓',
  Health: '💊',
  Other: '📌',
}

export default function TransactionForm({ transaction, onSubmit, onCancel, isLoading = false }) {
  const { addTransaction, updateTransaction } = useFinance()
  const [formData, setFormData] = useState({
    type: 'expense',
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  // Populate form if editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        title: transaction.title,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date.split('T')[0],
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || '',
      })
    }
  }, [transaction])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a transaction description'
    }

    const amount = parseFloat(formData.amount)
    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Amount must be greater than ₹0'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date'
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: '', // Reset category when type changes
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const transactionData = {
      type: formData.type,
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    }

    if (transaction) {
      // Edit mode
      updateTransaction(transaction.id, transactionData)
    } else {
      // Add mode
      addTransaction(transactionData)
    }

    onSubmit()
  }

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Transaction Type */}
      <TypeSelector value={formData.type} onChange={handleTypeChange} />

      {/* Description */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          Description *
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Grocery Shopping"
          className="input-field"
        />
        {errors.title && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {errors.title}
          </div>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          Amount (₹) *
        </label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="input-field"
        />
        {errors.amount && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {errors.amount}
          </div>
        )}
      </div>

      {/* Category */}
      <CategoryPicker
        value={formData.category}
        onChange={(category) => {
          setFormData(prev => ({ ...prev, category }))
          if (errors.category) {
            setErrors(prev => {
              const updated = { ...prev }
              delete updated.category
              return updated
            })
          }
        }}
        type={formData.type}
        error={errors.category}
      />

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          Date *
        </label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="input-field"
        />
        {errors.date && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {errors.date}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          Payment Method *
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
          className="input-field"
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {errors.paymentMethod && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {errors.paymentMethod}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any additional details..."
          rows="3"
          className="input-field"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  )
}
