import { useFinance } from '../context/FinanceContext'

export default function BudgetSummary() {
  const { budgets, transactions } = useFinance()

  const calculateSummary = () => {
    const today = new Date()
    let totalLimit = 0
    let totalSpent = 0

    budgets.forEach((budget) => {
      totalLimit += budget.monthlyLimit

      // Determine date range based on budget period
      let startDate, endDate

      if (budget.period === 'weekly') {
        const dayOfWeek = today.getDay()
        startDate = new Date(today)
        startDate.setDate(today.getDate() - dayOfWeek)
        startDate.setHours(0, 0, 0, 0)
        
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
      } else if (budget.period === 'yearly') {
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
      } else {
        // Default to monthly
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
      }

      const budgetSpent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce((sum, t) => sum + t.amount, 0)

      totalSpent += budgetSpent
    })

    const totalRemaining = Math.max(0, totalLimit - totalSpent)
    const totalPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0

    return { totalLimit, totalSpent, totalRemaining, totalPercentage }
  }

  const { totalLimit, totalSpent, totalRemaining, totalPercentage } = calculateSummary()

  if (budgets.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Budgets */}
      <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Budgets</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {budgets.length}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Active budget{budgets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Total Budget Amount */}
      <div className="card p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Limit</div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
          ₹{totalLimit.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          All budgets combined
        </div>
      </div>

      {/* Total Spent */}
      <div className="card p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Spent</div>
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
          ₹{totalSpent.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {totalPercentage}% of limit
        </div>
      </div>

      {/* Total Remaining */}
      <div className="card p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Remaining</div>
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
          ₹{totalRemaining.toLocaleString('en-IN')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Available across all budgets
        </div>
      </div>
    </div>
  )
}
