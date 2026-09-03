export default function TypeSelector({ value, onChange, error = null }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-3">
        💳 Transaction Type *
      </label>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => onChange('income')}
          className={`
            flex flex-col items-center justify-center gap-2 p-4 md:p-6
            rounded-xl transition-all duration-200
            border-2 font-semibold text-sm md:text-base
            ${
              value === 'income'
                ? 'border-income-500 bg-income-50 dark:bg-income-900/20 text-income-700 dark:text-income-300 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-income-300 dark:hover:border-income-700'
            }
          `}
        >
          <span className="text-4xl">💰</span>
          <span>Income</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('expense')}
          className={`
            flex flex-col items-center justify-center gap-2 p-4 md:p-6
            rounded-xl transition-all duration-200
            border-2 font-semibold text-sm md:text-base
            ${
              value === 'expense'
                ? 'border-expense-500 bg-expense-50 dark:bg-expense-900/20 text-expense-700 dark:text-expense-300 shadow-md'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-expense-300 dark:hover:border-expense-700'
            }
          `}
        >
          <span className="text-4xl">🛒</span>
          <span>Expense</span>
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}
