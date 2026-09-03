import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import ChartCard from './ChartCard'

export default function BudgetOverview() {
  const { budgets, transactions } = useFinance()

  // Calculate spent amount for each budget based on its period
  const getBudgetStatus = (budget) => {
    const today = new Date()
    let startDate, endDate

    // Determine date range based on budget period
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

    const spent = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === budget.category &&
          new Date(t.date) >= startDate &&
          new Date(t.date) <= endDate
      )
      .reduce((sum, t) => sum + t.amount, 0)

    const percentage = budget.monthlyLimit > 0 ? Math.round((spent / budget.monthlyLimit) * 100) : 0
    const remaining = Math.max(0, budget.monthlyLimit - spent)

    let status = 'safe'
    if (percentage > 100) status = 'exceeded'
    else if (percentage >= 90) status = 'critical'
    else if (percentage >= 70) status = 'warning'

    return { spent, percentage, remaining, status }
  }

  const displayedBudgets = budgets.slice(0, 3)

  const statusColors = {
    safe: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-amber-100 dark:bg-amber-900/30',
    critical: 'bg-orange-100 dark:bg-orange-900/30',
    exceeded: 'bg-red-100 dark:bg-red-900/30',
  }

  const statusTextColors = {
    safe: 'text-green-700 dark:text-green-400',
    warning: 'text-amber-700 dark:text-amber-400',
    critical: 'text-orange-700 dark:text-orange-400',
    exceeded: 'text-red-700 dark:text-red-400',
  }

  const statusProgressColors = {
    safe: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500',
  }

  return (
    <ChartCard
      title="💳 Budget Overview"
      subtitle="Track your spending limits"
      action={
        <Link
          to="/budgets"
          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      }
    >
      {displayedBudgets.length > 0 ? (
        <div className="space-y-5">
          {displayedBudgets.map((budget) => {
            const { spent, percentage, remaining, status } = getBudgetStatus(budget)
            return (
              <div key={budget.id} className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-50">
                      {budget.category}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ₹{spent.toLocaleString('en-IN')} of ₹{budget.monthlyLimit.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} ${statusTextColors[status]}`}
                  >
                    {percentage}%
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusProgressColors[status]} transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {/* Status message */}
                {status !== 'safe' && (
                  <p className={`text-xs ${statusTextColors[status]}`}>
                    {status === 'warning' && `⚠️ You've used ${percentage}% of your budget`}
                    {status === 'critical' && `⚠️ Critical: Only ₹${remaining.toLocaleString('en-IN')} remaining`}
                    {status === 'exceeded' && `❌ Budget exceeded by ₹${(spent - budget.monthlyLimit).toLocaleString('en-IN')}`}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No budgets created yet</p>
          <Link
            to="/budgets"
            className="inline-block mt-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
          >
            Create your first budget →
          </Link>
        </div>
      )}
    </ChartCard>
  )
}
