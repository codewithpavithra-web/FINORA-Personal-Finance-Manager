import { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/RecentTransactions'
import FinancialInsights from '../components/FinancialInsights'
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react'

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#6366f1', '#f43f5e', '#84cc16', '#14b8a6',
]

const EXPENSE_CATEGORIES = [
  'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment',
  'Education', 'Health', 'Other',
]

const CATEGORY_EMOJIS = {
  Food: '🍚', Shopping: '🛍️', Transport: '🚌', Bills: '💡',
  Entertainment: '🎬', Education: '🎓', Health: '💊', Other: '📌',
}

export default function Analytics() {
  const { transactions, budgets, savingsGoals, calculateIncome, calculateExpenses, calculateSavings, calculateBalance } = useFinance()

  // Date range state
  const [dateRange, setDateRange] = useState('thisMonth')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Calculate date range based on selection
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
      case 'last3Months':
        startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 3)
        endDate = today
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

  // Calculate summary statistics
  const stats = useMemo(() => {
    const income = calculateIncome(startDate, endDate)
    const expenses = calculateExpenses(startDate, endDate)
    const savings = calculateSavings(startDate, endDate)
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
    const balance = calculateBalance()

    return { income, expenses, savings, savingsRate, balance }
  }, [startDate, endDate, calculateIncome, calculateExpenses, calculateSavings, calculateBalance])

  // Calculate expense by category
  const expenseByCategory = useMemo(() => {
    const categoryTotals = {}
    transactions.forEach((t) => {
      if (
        t.type === 'expense' &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
      ) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      }
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        emoji: CATEGORY_EMOJIS[category] || '📌',
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions, startDate, endDate])

  // Calculate monthly spending trend
  const monthlyTrend = useMemo(() => {
    const monthlyData = {}

    transactions.forEach((t) => {
      const transDate = new Date(t.date)
      if (transDate >= startDate && transDate <= endDate) {
        const monthKey = transDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 }
        }

        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount
        } else {
          monthlyData[monthKey].expense += t.amount
        }
      }
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        Income: data.income,
        Expenses: data.expense,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA - dateB
      })
  }, [transactions, startDate, endDate])

  // Income trend over time
  const incomeTrend = useMemo(() => {
    const monthlyData = {}

    transactions.forEach((t) => {
      if (t.type === 'income') {
        const transDate = new Date(t.date)
        if (transDate >= startDate && transDate <= endDate) {
          const monthKey = transDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0
          }
          monthlyData[monthKey] += t.amount
        }
      }
    })

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({
        month,
        Income: amount,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA - dateB
      })
  }, [transactions, startDate, endDate])

  // Top expense categories
  const topCategories = expenseByCategory.slice(0, 5)

  // Recent transactions in range
  const recentInRange = transactions
    .filter((t) => new Date(t.date) >= startDate && new Date(t.date) <= endDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // Budget performance in current period
  const budgetPerformance = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce((sum, t) => sum + t.amount, 0)

      const remaining = Math.max(0, budget.monthlyLimit - spent)
      const percentage = Math.round((spent / budget.monthlyLimit) * 100)

      return {
        category: budget.category,
        limit: budget.monthlyLimit,
        spent,
        remaining,
        percentage,
        status:
          percentage < 70
            ? 'Under Budget'
            : percentage < 90
              ? 'On Track'
              : percentage < 100
                ? 'Near Limit'
                : 'Over Budget',
        statusColor:
          percentage < 70
            ? 'text-green-600 dark:text-green-400'
            : percentage < 90
              ? 'text-blue-600 dark:text-blue-400'
              : percentage < 100
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-red-600 dark:text-red-400',
      }
    })
  }, [budgets, transactions, startDate, endDate])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          📊 Financial Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Understand where your money comes from, where it goes, and how you are progressing toward your goals.
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-soft">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
            📅 Select Period
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'thisWeek', label: 'This Week' },
              { value: 'thisMonth', label: 'This Month' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'last3Months', label: 'Last 3 Months' },
              { value: 'thisYear', label: 'This Year' },
              { value: 'allTime', label: 'All Time' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateRange === option.value
                    ? 'bg-primary-600 text-white dark:bg-primary-600'
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
          <button
            onClick={() => setDateRange('custom')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              dateRange === 'custom'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Income"
          value={stats.income}
          icon={TrendingUp}
          variant="income"
          trendLabel={`₹${stats.income.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Expenses"
          value={stats.expenses}
          icon={TrendingDown}
          variant="expense"
          trendLabel={`₹${stats.expenses.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Savings"
          value={stats.savings}
          icon={PiggyBank}
          variant="savings"
          trendLabel={`₹${stats.savings.toLocaleString('en-IN')}`}
        />
        <StatCard
          title="Savings Rate"
          value={stats.savingsRate}
          icon={TrendingUp}
          variant="income"
          trendLabel={`${stats.savingsRate}%`}
        />
        <StatCard
          title="Balance"
          value={stats.balance}
          icon={Wallet}
          variant="balance"
          trendLabel={`₹${stats.balance.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Financial Insights */}
      <FinancialInsights />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <ChartCard
          title="💰 Income vs Expenses"
          subtitle="Comparison over time"
        >
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
              📊 No data available yet
            </div>
          )}
        </ChartCard>

        {/* Expense by Category Pie Chart */}
        <ChartCard
          title="🎯 Expenses by Category"
          subtitle="Spending breakdown"
        >
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
              📊 No expense data available
            </div>
          )}
        </ChartCard>

        {/* Income Trend Chart */}
        <ChartCard
          title="📈 Income Trend"
          subtitle="Income over time"
        >
          {incomeTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400">
              📊 No income data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Top Expense Categories */}
      {topCategories.length > 0 && (
        <ChartCard
          title="🥇 Top Expense Categories"
          subtitle="Your largest spending areas"
        >
          <div className="space-y-3">
            {topCategories.map((cat, idx) => {
              const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
              return (
                <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medals[idx]}</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        {cat.emoji} {cat.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      ₹{cat.value.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {stats.expenses > 0
                        ? Math.round((cat.value / stats.expenses) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      )}

      {/* Budget Analytics */}
      {budgetPerformance.length > 0 && (
        <ChartCard
          title="📊 Budget Performance"
          subtitle="How you're tracking against your budgets"
        >
          <div className="space-y-4">
            {budgetPerformance.map((budget) => (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">
                      {CATEGORY_EMOJIS[budget.category] || '📌'} {budget.category}
                    </p>
                    <p className={`text-sm font-medium ${budget.statusColor}`}>
                      {budget.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {budget.percentage}% used
                    </p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      budget.percentage < 70
                        ? 'bg-green-500'
                        : budget.percentage < 90
                          ? 'bg-blue-500'
                          : budget.percentage < 100
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Savings Goals Analytics */}
      {savingsGoals.length > 0 && (
        <ChartCard
          title="🎯 Savings Goals Progress"
          subtitle="Track your goals"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map((goal) => {
              const percentage = Math.round((goal.saved / goal.targetAmount) * 100)
              return (
                <div key={goal.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        {goal.icon} {goal.title}
                      </p>
                    </div>
                    <p className="font-bold text-primary-600 dark:text-primary-400">
                      {Math.min(percentage, 100)}%
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span>₹{goal.saved.toLocaleString('en-IN')}</span>
                    <span>₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      )}

      {/* Recent Transactions */}
      {recentInRange.length > 0 && (
        <ChartCard
          title="📋 Recent Activity"
          subtitle="Latest transactions in this period"
        >
          <div className="space-y-3">
            {recentInRange.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">
                    {transaction.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Empty State */}
      {transactions.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200/50 dark:border-slate-700/50 text-center">
          <p className="text-2xl mb-2">📊</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
            No data available yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Add some transactions to see your financial analytics.
          </p>
        </div>
      )}
    </div>
  )
}
