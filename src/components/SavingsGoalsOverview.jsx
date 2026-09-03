import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import ChartCard from './ChartCard'

export default function SavingsGoalsOverview() {
  const { savingsGoals } = useFinance()

  const displayedGoals = savingsGoals.slice(0, 3)

  const getProgressPercentage = (goal) => {
    return Math.round((goal.saved / goal.targetAmount) * 100)
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <ChartCard
      title="🎯 Savings Goals"
      subtitle="Progress towards your goals"
      action={
        <Link
          to="/savings"
          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      }
    >
      {displayedGoals.length > 0 ? (
        <div className="space-y-5">
          {displayedGoals.map((goal) => {
            const percentage = getProgressPercentage(goal)
            const daysRemaining = getDaysRemaining(goal.dueDate)

            return (
              <div key={goal.id} className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{goal.icon}</div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-50">
                        {goal.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        ₹{goal.saved.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-50">
                      {percentage}%
                    </div>
                    {daysRemaining > 0 && (
                      <div className="text-slate-500 dark:text-slate-400">
                        {daysRemaining} days left
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {/* Status */}
                {percentage === 100 ? (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <Zap size={14} />
                    <span>Goal completed! 🎉</span>
                  </div>
                ) : percentage >= 75 ? (
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    Almost there! ₹{(goal.targetAmount - goal.saved).toLocaleString('en-IN')} to go
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No savings goals yet</p>
          <Link
            to="/savings"
            className="inline-block mt-3 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
          >
            Create your first goal →
          </Link>
        </div>
      )}
    </ChartCard>
  )
}
