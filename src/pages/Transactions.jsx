import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import TransactionSearch from '../components/TransactionSearch'
import TransactionFilters from '../components/TransactionFilters'
import Toast from '../components/Toast'

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance()

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'all',
    sortBy: 'newest',
  })

  // Toast states
  const [toast, setToast] = useState(null)

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.paymentMethod.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type)
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date()
      const startDate = new Date()

      switch (filters.dateRange) {
        case 'today':
          result = result.filter(
            (t) =>
              new Date(t.date).toDateString() === today.toDateString()
          )
          break
        case 'week':
          startDate.setDate(today.getDate() - 7)
          result = result.filter((t) => new Date(t.date) >= startDate)
          break
        case 'month':
          startDate.setMonth(today.getMonth())
          startDate.setDate(1)
          result = result.filter((t) => new Date(t.date) >= startDate)
          break
        case 'quarter':
          startDate.setMonth(today.getMonth() - 3)
          result = result.filter((t) => new Date(t.date) >= startDate)
          break
        case 'year':
          startDate.setFullYear(today.getFullYear())
          startDate.setMonth(0)
          startDate.setDate(1)
          result = result.filter((t) => new Date(t.date) >= startDate)
          break
        default:
          break
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'highest':
        result.sort((a, b) => b.amount - a.amount)
        break
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount)
        break
      default:
        break
    }

    return result
  }, [transactions, searchQuery, filters])

  // Handlers
  const handleAddTransaction = () => {
    setIsAddModalOpen(false)
    showToast('Transaction added successfully!', 'success')
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleSaveEdit = () => {
    setEditingTransaction(null)
    showToast('Transaction updated successfully!', 'success')
  }

  const handleDeleteClick = (transaction) => {
    setDeleteConfirm(transaction)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteTransaction(deleteConfirm.id)
      setDeleteConfirm(null)
      showToast('Transaction deleted successfully!', 'success')
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateRange: 'all',
      sortBy: 'newest',
    })
    setSearchQuery('')
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Transactions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <TransactionSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TransactionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteClick}
      />

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Transaction"
        size="lg"
      >
        <TransactionForm
          transaction={null}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
        size="lg"
      >
        {editingTransaction && (
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingTransaction(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Transaction"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300">
                Are you sure you want to delete this transaction?
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-50 mt-2">
                {deleteConfirm.title} - ₹{deleteConfirm.amount.toLocaleString('en-IN')}
              </p>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              This action cannot be undone. This will also update your dashboard calculations.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 btn-danger"
              >
                Delete Transaction
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
