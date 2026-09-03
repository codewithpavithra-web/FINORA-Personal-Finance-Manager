import { Zap, Edit2, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'

export default function SavingsGoalList({ goals, onEdit, onDelete, onAddMoney }) {
  const [addMoneyGoal, setAddMoneyGoal] = useState(null)
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [moneyErrors, setMoneyErrors] = useState('')

  const getProgressPercentage = (goal) => {
    return Math.round((goal.saved / goal.targetAmount) * 100)
  }

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : null
  }

  const handleAddMoneySubmit = () => {
    setMoneyErrors('')

    if (!addMoneyAmount) {
      setMoneyErrors('Please enter an amount.')
      return
    }

    const amount = parseFloat(addMoneyAmount)
    if (isNaN(amount) || amount <= 0) {
      setMoneyErrors('Amount must be greater than ₹0.')
      return
    }

    onAddMoney(addMoneyGoal.id, amount)
    setAddMoneyGoal(null)
    setAddMoneyAmount('')
  }

  const handleAddMoneyCancel = () => {
    setAddMoneyGoal(null)
    setAddMoneyAmount('')
    setMoneyErrors('')
  }

  if (goals.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-soft dark:shadow-sm text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          No savings goals yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Start saving for something important. Create your first goal today!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const percentage = getProgressPercentage(goal)
        const daysRemaining = getDaysRemaining(goal.dueDate)
        const isCompleted = percentage >= 100

        return (
          <div
            key={goal.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-soft dark:shadow-sm transition-all hover:shadow-md dark:hover:shadow-slate-700/50"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">{goal.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    ₹{goal.saved.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')} saved
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {isCompleted ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                  <Zap size={16} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Complete
                  </span>
                </div>
              ) : daysRemaining && daysRemaining < 30 ? (
                <div className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {daysRemaining} days left
                  </span>
                </div>
              ) : null}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Progress
                </span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {Math.min(percentage, 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Target</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  ₹{goal.targetAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Saved</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  ₹{goal.saved.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Remaining</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  ₹{Math.max(0, goal.targetAmount - goal.saved).toLocaleString('en-IN')}
                </p>
              </div>
              {goal.dueDate && (
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Target Date</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {new Date(goal.dueDate).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Status Message */}
            {isCompleted ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                <Zap size={16} />
                <span>🎉 Goal completed! Congratulations on your achievement!</span>
              </div>
            ) : percentage >= 75 ? (
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
                💪 Almost there! ₹{Math.max(0, goal.targetAmount - goal.saved).toLocaleString('en-IN')} to go
              </p>
            ) : null}

            {/* Add Money Form - Hidden by default, shown when button clicked */}
            {addMoneyGoal?.id === goal.id && (
              <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg mb-4 space-y-3 border border-slate-200 dark:border-slate-600">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  💰 Add Money to {goal.title}
                </label>
                <input
                  type="number"
                  value={addMoneyAmount}
                  onChange={(e) => {
                    setAddMoneyAmount(e.target.value)
                    if (moneyErrors) setMoneyErrors('')
                  }}
                  placeholder="Enter amount (₹)"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                {moneyErrors && (
                  <p className="text-sm text-red-600 dark:text-red-400">{moneyErrors}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMoneySubmit}
                    className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Add Money
                  </button>
                  <button
                    onClick={handleAddMoneyCancel}
                    className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {!isCompleted && (
                <button
                  onClick={() => setAddMoneyGoal(goal)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg font-medium transition-colors text-sm"
                >
                  <Plus size={16} />
                  💰 Add Money
                </button>
              )}
              <button
                onClick={() => onEdit(goal)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm"
              >
                <Edit2 size={16} />
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(goal)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors text-sm"
              >
                <Trash2 size={16} />
                🗑️ Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
