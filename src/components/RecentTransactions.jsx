import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import ChartCard from './ChartCard'

const categoryIcons = {
  Salary: '💰',
  Food: '🍔',
  Shopping: '🛍️',
  Transport: '🚗',
  Bills: '📄',
  Entertainment: '🎬',
  Education: '📚',
  Health: '⚕️',
  Other: '📌',
}

export default function RecentTransactions() {
  const { transactions } = useFinance()

  // Sort by date and get last 5
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <ChartCard
      title="📋 Recent Transactions"
      subtitle="Your latest financial activity"
      action={
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
        >
          View All
          <ChevronRight size={16} />
        </Link>
      }
    >
      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
            >
              {/* Left side - Icon and details */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="text-2xl flex-shrink-0">
                  {categoryIcons[transaction.category] || '📌'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                    {transaction.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {transaction.category}
                  </p>
                </div>
              </div>

              {/* Middle - Date */}
              <div className="text-sm text-slate-500 dark:text-slate-400 text-right px-4">
                {formatDate(transaction.date)}
              </div>

              {/* Right side - Amount with icon */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-slate-900 dark:text-slate-50'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownLeft size={16} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No transactions yet</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            Add your first transaction to get started
          </p>
        </div>
      )}
    </ChartCard>
  )
}
