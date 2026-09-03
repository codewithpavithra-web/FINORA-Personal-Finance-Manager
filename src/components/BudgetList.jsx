import { Edit, Trash2, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'

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

export default function BudgetList({ budgets, transactions, onEdit, onDelete }) {
  const calculateBudgetStatus = (budget) => {
    const today = new Date()
    let startDate, endDate

    // Determine date range based on budget period
    if (budget.period === 'weekly') {
      // Get start and end of current week (Sunday to Saturday)
      const dayOfWeek = today.getDay()
      startDate = new Date(today)
      startDate.setDate(today.getDate() - dayOfWeek)
      startDate.setHours(0, 0, 0, 0)
      
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
    } else if (budget.period === 'yearly') {
      // Get start and end of current year
      startDate = new Date(today.getFullYear(), 0, 1)
      endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999)
    } else {
      // Default to monthly
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)
    }

    // Calculate spending from transactions for this budget's category in the period
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
    const exceeded = Math.max(0, spent - budget.monthlyLimit)

    let status = 'safe'
    if (percentage > 100) status = 'exceeded'
    else if (percentage >= 90) status = 'critical'
    else if (percentage >= 70) status = 'warning'

    return { spent, percentage, remaining, exceeded, status }
  }

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

  const statusIcons = {
    safe: <CheckCircle size={20} className="text-green-600 dark:text-green-400" />,
    warning: <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />,
    critical: <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400" />,
    exceeded: <AlertCircle size={20} className="text-red-600 dark:text-red-400" />,
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📊</div>
        <p className="text-slate-700 dark:text-slate-300 text-lg font-medium mb-2">
          No budgets created yet
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Create your first budget to start tracking your spending
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const { spent, percentage, remaining, exceeded, status } = calculateBudgetStatus(budget)

        return (
          <div
            key={budget.id}
            className={`p-5 border-l-4 rounded-lg hover:shadow-md transition-all duration-200 ${
              status === 'safe'
                ? 'border-l-green-500 bg-green-50/30 dark:bg-green-900/10 hover:bg-green-50/50 dark:hover:bg-green-900/15'
                : status === 'warning'
                  ? 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10 hover:bg-amber-50/50 dark:hover:bg-amber-900/15'
                  : status === 'critical'
                    ? 'border-l-orange-500 bg-orange-50/30 dark:bg-orange-900/10 hover:bg-orange-50/50 dark:hover:bg-orange-900/15'
                    : 'border-l-red-500 bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50 dark:hover:bg-red-900/15'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{CATEGORY_EMOJIS[budget.category] || '📌'}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">
                    {budget.category}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {budget.period ? budget.period.charAt(0).toUpperCase() + budget.period.slice(1) : 'Monthly'} Budget
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ₹{spent.toLocaleString('en-IN')} of ₹{budget.monthlyLimit.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Status badge and actions */}
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusColors[status]}`}>
                  {statusIcons[status]}
                  <span className={`text-sm font-semibold ${statusTextColors[status]}`}>
                    {percentage}%
                  </span>
                </div>

                <button
                  onClick={() => onEdit(budget)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  title="Edit budget"
                  aria-label={`Edit ${budget.category} budget`}
                >
                  <Edit size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => onDelete(budget)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete budget"
                  aria-label={`Delete ${budget.category} budget`}
                >
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${statusProgressColors[status]} transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Status message */}
            <div className="flex items-center gap-2">
              {status === 'safe' && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  ✅ On Track • ₹{remaining.toLocaleString('en-IN')} remaining
                </p>
              )}
              {status === 'warning' && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  🟡 Approaching Limit • {percentage}% used • ₹{remaining.toLocaleString('en-IN')} remaining
                </p>
              )}
              {status === 'critical' && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  🟠 Almost Exceeded • Only ₹{remaining.toLocaleString('en-IN')} left
                </p>
              )}
              {status === 'exceeded' && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  🔴 Over Budget • Exceeded by ₹{exceeded.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
