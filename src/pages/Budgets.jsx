import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Modal from '../components/Modal'
import BudgetForm from '../components/BudgetForm'
import BudgetList from '../components/BudgetList'
import Toast from '../components/Toast'

export default function Budgets() {
  const { budgets, deleteBudget, transactions } = useFinance()

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Toast states
  const [toast, setToast] = useState(null)

  // Calculate total statistics
  const calculateTotalStats = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    let totalBudget = 0
    let totalSpent = 0

    budgets.forEach((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            new Date(t.date) >= firstDayOfMonth &&
            new Date(t.date) <= lastDayOfMonth
        )
        .reduce((sum, t) => sum + t.amount, 0)

      totalBudget += budget.monthlyLimit
      totalSpent += spent
    })

    const totalRemaining = Math.max(0, totalBudget - totalSpent)

    return {
      count: budgets.length,
      totalBudget,
      totalSpent,
      totalRemaining,
    }
  }

  // Handlers
  const handleAddBudget = () => {
    setIsAddModalOpen(false)
    showToast('✅ Budget created successfully!', 'success')
  }

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
  }

  const handleSaveEdit = () => {
    setEditingBudget(null)
    showToast('✅ Budget updated successfully!', 'success')
  }

  const handleDeleteClick = (budget) => {
    setDeleteConfirm(budget)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteBudget(deleteConfirm.id)
      setDeleteConfirm(null)
      showToast('🗑️ Budget deleted successfully!', 'success')
    }
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const stats = calculateTotalStats()

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            📊 Budgets
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {budgets.length === 0
              ? 'Create your first budget to start tracking your spending'
              : `${stats.count} budget${stats.count !== 1 ? 's' : ''} • Manage and track your spending`}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary whitespace-nowrap"
        >
          ➕ Add Budget
        </button>
      </div>

      {/* Summary Stats (if budgets exist) */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Budgets */}
          <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">📊 Total Budgets</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.count}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active budget{stats.count !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Total Budget Amount */}
          <div className="card p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">💰 Total Limit</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ₹{stats.totalBudget.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">All budgets combined</div>
          </div>

          {/* Total Spent */}
          <div className="card p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">💸 Total Spent</div>
            <div className={`text-3xl font-bold ${
              stats.totalSpent > stats.totalBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              ₹{stats.totalSpent.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.totalBudget > 0 ? Math.round((stats.totalSpent / stats.totalBudget) * 100) : 0}% of limit
            </div>
          </div>

          {/* Total Remaining */}
          <div className="card p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">💵 Total Remaining</div>
            <div className={`text-3xl font-bold ${
              stats.totalSpent > stats.totalBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              ₹{stats.totalRemaining.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Available to spend</div>
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="card">
        <BudgetList
          budgets={budgets}
          transactions={transactions}
          onEdit={handleEditBudget}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Info Section */}
      {budgets.length > 0 && (
        <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">💡 Budget Tips</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>✓ Set realistic budgets based on your spending patterns</li>
            <li>✓ Review your budgets monthly and adjust as needed</li>
            <li>✓ Use categories to track different spending areas</li>
            <li>✓ Budgets are calculated for the current month automatically</li>
            <li>✓ Spending is calculated from your transactions in real-time</li>
          </ul>
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="➕ Create Budget"
      >
        <BudgetForm
          budget={null}
          onSubmit={handleAddBudget}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title="✏️ Edit Budget"
      >
        {editingBudget && (
          <BudgetForm
            budget={editingBudget}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingBudget(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="🗑️ Delete Budget"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                Are you sure you want to delete this budget?
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-50">
                {deleteConfirm.category} - ₹{deleteConfirm.monthlyLimit.toLocaleString('en-IN')}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              💡 This will not affect your transactions, only remove the budget tracking.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 btn-danger"
              >
                Delete Budget
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  )
}
