import { ArrowUpRight, ArrowDownLeft, Edit2, Trash2 } from 'lucide-react'

const categoryIcons = {
  Salary: '💰',
  Freelance: '💼',
  Investment: '📈',
  Bonus: '🎁',
  Gift: '🎀',
  Food: '🍔',
  Shopping: '🛍️',
  Transport: '🚗',
  Bills: '📄',
  Entertainment: '🎬',
  Education: '📚',
  Health: '⚕️',
  Other: '📌',
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-3">📭</div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-1">
          No transactions found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Try adjusting your filters or add a new transaction.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-50">
                Payment
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">
                Amount
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {categoryIcons[transaction.category] || '📌'}
                    </span>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        {transaction.title}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right">
                  <span
                    className={
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-slate-900 dark:text-slate-50'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {transaction.amount.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      disabled={isLoading}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction)}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">
                    {categoryIcons[transaction.category] || '📌'}
                  </span>
                  <h3 className="font-medium text-slate-900 dark:text-slate-50">
                    {transaction.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(transaction.date)} • {transaction.category}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-900 dark:text-slate-50'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}₹
                {transaction.amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Notes */}
            {transaction.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {transaction.notes}
              </p>
            )}

            {/* Payment method */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {transaction.paymentMethod}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(transaction)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Edit2 size={14} />
                Edit
              </button>
              <button
                onClick={() => onDelete(transaction)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
