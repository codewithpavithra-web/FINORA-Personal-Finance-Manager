import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Modal from '../components/Modal'
import SavingsGoalForm from '../components/SavingsGoalForm'
import SavingsGoalList from '../components/SavingsGoalList'
import Toast from '../components/Toast'

export default function Savings() {
  const {
    savingsGoals,
    deleteSavingsGoal,
    updateSavingsGoal,
  } = useFinance()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const calculateTotalStats = () => {
    let totalTarget = 0
    let totalSaved = 0

    savingsGoals.forEach((goal) => {
      const target = Number(goal.targetAmount) || 0
      const saved = Number(goal.saved) || 0

      totalTarget += target
      totalSaved += saved
    })

    const totalRemaining = Math.max(
      0,
      totalTarget - totalSaved
    )

    const averageProgress =
      totalTarget > 0
        ? Math.min(
            Math.round((totalSaved / totalTarget) * 100),
            100
          )
        : 0

    return {
      count: savingsGoals.length,
      totalTarget,
      totalSaved,
      totalRemaining,
      averageProgress,
    }
  }

  const handleAddGoal = () => {
    setIsAddModalOpen(false)

    showToast(
      'Savings goal created successfully!',
      'success'
    )
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal)
  }

  const handleSaveEdit = () => {
    setEditingGoal(null)

    showToast(
      'Savings goal updated successfully!',
      'success'
    )
  }

  const handleDeleteClick = (goal) => {
    setDeleteConfirm(goal)
  }

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return

    deleteSavingsGoal(deleteConfirm.id)
    setDeleteConfirm(null)

    showToast(
      'Savings goal deleted!',
      'success'
    )
  }

  const handleAddMoney = (goalId, amount) => {
    const goal = savingsGoals.find(
      (item) => item.id === goalId
    )

    if (!goal) return

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      showToast(
        'Please enter a valid amount.',
        'error'
      )
      return
    }

    const currentSaved = Number(goal.saved) || 0
    const targetAmount = Number(goal.targetAmount) || 0

    const newSaved = Math.min(
      currentSaved + numericAmount,
      targetAmount
    )

    updateSavingsGoal(goalId, {
      saved: newSaved,
    })

    showToast(
      `Added ₹${numericAmount.toLocaleString('en-IN')} to ${goal.title}!`,
      'success'
    )
  }

  const stats = calculateTotalStats()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            🎯 Savings Goals
          </h1>

          <p className="text-slate-600 dark:text-slate-400">
            Track your progress towards your financial goals
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
        >
          ➕ Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      {stats.count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Active Goals */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
              📊 Active Goals
            </p>

            <p className="text-3xl font-bold text-blue-900 dark:text-blue-50 mb-2">
              {stats.count}
            </p>

            <p className="text-xs text-blue-600 dark:text-blue-400">
              {stats.count === 1 ? 'goal' : 'goals'} being tracked
            </p>
          </div>

          {/* Total Target */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
              🎯 Total Target
            </p>

            <p className="text-3xl font-bold text-purple-900 dark:text-purple-50 mb-2">
              ₹{stats.totalTarget.toLocaleString('en-IN')}
            </p>

            <p className="text-xs text-purple-600 dark:text-purple-400">
              Combined goal amount
            </p>
          </div>

          {/* Total Saved */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
              💰 Total Saved
            </p>

            <p className="text-3xl font-bold text-orange-900 dark:text-orange-50 mb-2">
              ₹{stats.totalSaved.toLocaleString('en-IN')}
            </p>

            <p className="text-xs text-orange-600 dark:text-orange-400">
              {stats.averageProgress}% of total target
            </p>
          </div>

          {/* Total Remaining */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
              💵 Total Remaining
            </p>

            <p className="text-3xl font-bold text-green-900 dark:text-green-50 mb-2">
              ₹{stats.totalRemaining.toLocaleString('en-IN')}
            </p>

            <p className="text-xs text-green-600 dark:text-green-400">
              Still need to save
            </p>
          </div>

        </div>
      )}

      {/* Savings Goals List */}
      <SavingsGoalList
        goals={savingsGoals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteClick}
        onAddMoney={handleAddMoney}
      />

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          title="➕ Add a New Savings Goal"
          onClose={() => setIsAddModalOpen(false)}
        >
          <SavingsGoalForm
            goal={null}
            onSubmit={handleAddGoal}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <Modal
          isOpen={true}
          title="✏️ Edit Savings Goal"
          onClose={() => setEditingGoal(null)}
        >
          <SavingsGoalForm
            goal={editingGoal}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingGoal(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={true}
          title="🗑️ Delete Savings Goal?"
          onClose={() => setDeleteConfirm(null)}
        >
          <div className="space-y-5">

            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                {deleteConfirm.icon} {deleteConfirm.title}
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Are you sure you want to delete this savings goal?
                This action cannot be undone.
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
                Current progress: ₹
                {Number(deleteConfirm.saved || 0).toLocaleString('en-IN')}
                {' '}of{' '}
                ₹
                {Number(deleteConfirm.targetAmount || 0).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                onClick={handleConfirmDelete}
                className="flex-1 btn-danger"
              >
                🗑️ Yes, Delete
              </button>

              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

    </div>
  )
}