import { useState } from 'react'

const INCOME_CATEGORIES = [
  { value: 'Salary', icon: '💼', label: 'Salary' },
  { value: 'Freelance', icon: '💻', label: 'Freelance' },
  { value: 'Investment', icon: '📈', label: 'Investment' },
  { value: 'Bonus', icon: '🎁', label: 'Bonus' },
  { value: 'Gift', icon: '🎀', label: 'Gift' },
  { value: 'Other', icon: '📌', label: 'Other' },
]

const EXPENSE_CATEGORIES = [
  { value: 'Food', icon: '🍚', label: 'Food' },
  { value: 'Shopping', icon: '🛍️', label: 'Shopping' },
  { value: 'Transport', icon: '🚌', label: 'Travel' },
  { value: 'Bills', icon: '💡', label: 'Bills' },
  { value: 'Entertainment', icon: '🎬', label: 'Entertainment' },
  { value: 'Education', icon: '🎓', label: 'Education' },
  { value: 'Health', icon: '💊', label: 'Health' },
  { value: 'Other', icon: '📌', label: 'Other' },
]

export default function CategoryPicker({
  value,
  onChange,
  type = 'expense',
  error = null,
}) {
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const [showMore, setShowMore] = useState(false)

  const displayedCategories = showMore ? categories : categories.slice(0, 4)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">
        Category *
      </label>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {displayedCategories.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`
              flex flex-col items-center justify-center gap-1 p-3 md:p-4
              rounded-lg transition-all duration-200
              border-2 text-xs md:text-sm font-medium
              ${
                value === category.value
                  ? `border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300`
                  : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600`
              }
            `}
            title={category.label}
          >
            <span className="text-2xl md:text-3xl">{category.icon}</span>
            <span className="text-center leading-tight">{category.label}</span>
          </button>
        ))}
      </div>

      {categories.length > 4 && (
        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          {showMore ? '▲ Show Less' : '▼ Show More'}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}
