import { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { Download, Upload, Printer, AlertCircle, CheckCircle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#6366f1', '#f43f5e', '#84cc16', '#14b8a6',
]

const EXPENSE_CATEGORIES = [
  'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment',
  'Education', 'Health', 'Other',
]

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other',
]

export default function Reports() {
  const { transactions, budgets, savingsGoals, profile, calculateIncome, calculateExpenses, calculateSavings, calculateBalance, importData } = useFinance()

  // Date range state
  const [dateRange, setDateRange] = useState('thisMonth')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Modal states
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importedData, setImportedData] = useState(null)

  // Toast state
  const [toast, setToast] = useState(null)

  // Calculate date range
  const getDateRange = () => {
    const today = new Date()
    let startDate, endDate

    switch (dateRange) {
      case 'thisWeek':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        startDate = weekStart
        endDate = today
        break
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = today
        break
      case 'allTime':
        startDate = new Date('2000-01-01')
        endDate = today
        break
      case 'custom':
        startDate = customStart ? new Date(customStart) : today
        endDate = customEnd ? new Date(customEnd) : today
        break
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getDateRange()

  // Calculate report data
  const reportData = useMemo(() => {
    const income = calculateIncome(startDate, endDate)
    const expenses = calculateExpenses(startDate, endDate)
    const savings = calculateSavings(startDate, endDate)
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
    const balance = calculateBalance()

    const transactionsInRange = transactions.filter(
      t => new Date(t.date) >= startDate && new Date(t.date) <= endDate
    )

    // Expense categories
    const expenseCategoryData = {}
    transactionsInRange
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseCategoryData[t.category] = (expenseCategoryData[t.category] || 0) + t.amount
      })

    const expenseCategories = Object.entries(expenseCategoryData)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)

    // Income categories
    const incomeCategoryData = {}
    transactionsInRange
      .filter(t => t.type === 'income')
      .forEach(t => {
        incomeCategoryData[t.category] = (incomeCategoryData[t.category] || 0) + t.amount
      })

    const incomeCategories = Object.entries(incomeCategoryData)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: income > 0 ? Math.round((amount / income) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value)

    // Top spending
    const topSpending = transactionsInRange
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    return {
      income,
      expenses,
      savings,
      savingsRate,
      balance,
      transactionCount: transactionsInRange.length,
      expenseCategories,
      incomeCategories,
      topSpending,
    }
  }, [transactions, startDate, endDate, calculateIncome, calculateExpenses, calculateSavings, calculateBalance])

  // Financial health summary
  const getFinancialHealthMessage = () => {
    const { income, expenses, savingsRate } = reportData

    if (income === 0) {
      return '📊 No income recorded for this period.'
    }

    if (expenses > income) {
      return `⚠️ Your expenses (₹${expenses.toLocaleString('en-IN')}) exceed your income (₹${income.toLocaleString('en-IN')}) this period.`
    }

    if (savingsRate >= 50) {
      return `💚 Excellent! You saved ${savingsRate}% of your income this period.`
    }

    if (savingsRate >= 25) {
      return `👍 Good work! You saved ${savingsRate}% of your income this period.`
    }

    if (savingsRate > 0) {
      return `🌱 You saved ${savingsRate}% of your income. Try to increase your savings rate.`
    }

    return `💔 You didn't save anything this period.`
  }

  // Export as JSON
  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      transactions,
      budgets,
      savingsGoals,
      profile,
    }

    const dataStr = JSON.stringify(backup, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finora-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast('✅ JSON backup exported successfully!', 'success')
  }

  // Export as CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'info')
      return
    }

    const headers = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Payment Method', 'Notes']
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('en-IN'),
      t.type,
      t.title,
      t.category,
      t.amount,
      t.paymentMethod || '',
      t.notes || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `finora-transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showToast('✅ CSV export successful!', 'success')
  }

  // Handle file import
  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result || '{}')
        
        // Validate structure
        if (!data.transactions || !data.budgets || !data.savingsGoals || !data.profile) {
          showToast('❌ Invalid backup file. Missing required data.', 'error')
          return
        }

        // Store for confirmation
        setImportedData(data)
        setShowImportConfirm(true)
      } catch (error) {
        showToast('❌ Invalid JSON file. Please check the file format.', 'error')
      }
    }

    reader.readAsText(file)
    e.target.value = ''
  }

  // Confirm and import
  const confirmImport = () => {
    if (!importedData) return

    try {
      importData(importedData)

      setShowImportConfirm(false)
      setImportedData(null)
      showToast('✅ Data imported successfully! The app will refresh.', 'success')

      // Refresh after a short delay
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      showToast('❌ Error importing data. Please try again.', 'error')
    }
  }

  // Print report
  const handlePrint = () => {
    window.print()
  }

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          📊 Financial Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View detailed financial reports and manage your data
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-soft print:hidden">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            📅 Select Period
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'thisWeek', label: 'This Week' },
              { value: 'thisMonth', label: 'This Month' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'thisYear', label: 'This Year' },
              { value: 'allTime', label: 'All Time' },
              { value: 'custom', label: 'Custom' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateRange === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom Range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Income"
          value={reportData.income}
          variant="income"
          trendLabel={`₹${reportData.income.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Expenses"
          value={reportData.expenses}
          variant="expense"
          trendLabel={`₹${reportData.expenses.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Savings"
          value={reportData.savings}
          variant="savings"
          trendLabel={`₹${reportData.savings.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Savings Rate"
          value={reportData.savingsRate}
          variant="income"
          trendLabel={`${reportData.savingsRate}%`}
        />
        <StatCard
          title="Transactions"
          value={reportData.transactionCount}
          variant="balance"
          trendLabel={`${reportData.transactionCount} transactions`}
        />
      </div>

      {/* Financial Health */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{reportData.savingsRate >= 25 ? '💚' : reportData.savingsRate > 0 ? '🌱' : '💔'}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Financial Health Summary
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {getFinancialHealthMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense by Category */}
        <ChartCard title="🎯 Expenses by Category" subtitle="Spending breakdown">
          {reportData.expenseCategories.length > 0 ? (
            <div className="space-y-3">
              {reportData.expenseCategories.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      ₹{cat.value.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cat.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              📊 No expense data available
            </div>
          )}
        </ChartCard>

        {/* Income by Category */}
        <ChartCard title="💰 Income by Category" subtitle="Income breakdown">
          {reportData.incomeCategories.length > 0 ? (
            <div className="space-y-3">
              {reportData.incomeCategories.map((cat, idx) => (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        {cat.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      ₹{cat.value.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cat.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              📊 No income data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Top Spending */}
      {reportData.topSpending.length > 0 && (
        <ChartCard title="🥇 Top Spending" subtitle="Highest expense transactions">
          <div className="space-y-3">
            {reportData.topSpending.map((trans, idx) => (
              <div key={trans.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}️⃣`}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">
                      {trans.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {trans.category} • {new Date(trans.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-50">
                  ₹{trans.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Data Management */}
      <ChartCard title="📦 Data Management" subtitle="Export and import your financial data">
        <div className="space-y-4">
          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-50">📤 Export Data</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                Export JSON Backup
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                Export Transactions (CSV)
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200 dark:border-slate-700" />

          {/* Import Section */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-50">📥 Import Backup</h4>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
              <Upload size={18} />
              Import JSON Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Print Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <Printer size={18} />
              Print Report
            </button>
          </div>
        </div>
      </ChartCard>

      {/* Import Confirmation Modal */}
      {showImportConfirm && importedData && (
        <Modal
          title="📥 Import Backup?"
          onClose={() => {
            setShowImportConfirm(false)
            setImportedData(null)
          }}
        >
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-50">
                    ⚠️ This will replace your current data
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Your existing FINORA data will be replaced with the imported backup. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Imported data includes:</strong>
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>✓ {importedData.transactions?.length || 0} transactions</li>
                <li>✓ {importedData.budgets?.length || 0} budgets</li>
                <li>✓ {importedData.savingsGoals?.length || 0} savings goals</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmImport}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                <CheckCircle size={18} />
                Yes, Import
              </button>
              <button
                onClick={() => {
                  setShowImportConfirm(false)
                  setImportedData(null)
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
