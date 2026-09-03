import { useEffect, useState } from 'react'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/RecentTransactions'
import BudgetOverview from '../components/BudgetOverview'
import SavingsGoalsOverview from '../components/SavingsGoalsOverview'
import FinancialInsights from '../components/FinancialInsights'

export default function Dashboard() {
  const { profile, calculateBalance, calculateIncome, calculateExpenses, calculateSavings } =
    useFinance()
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  })

  useEffect(() => {
    // Calculate statistics for current month
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const monthlyIncome = calculateIncome(firstDayOfMonth, lastDayOfMonth)
    const monthlyExpenses = calculateExpenses(firstDayOfMonth, lastDayOfMonth)
    const monthlySavings = calculateSavings(firstDayOfMonth, lastDayOfMonth)
    const totalBalance = calculateBalance()

    setStats({
      balance: totalBalance,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: monthlySavings,
    })
  }, [calculateBalance, calculateIncome, calculateExpenses, calculateSavings])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {getGreeting()}, {profile.name} 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's your financial overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          icon={Wallet}
          variant="balance"
          trend={stats.income > stats.expenses ? 1 : -1}
          trendLabel={stats.income > stats.expenses ? 'Positive' : 'Negative'}
        />
        <StatCard
          title="Income"
          value={stats.income}
          icon={TrendingUp}
          variant="income"
          trendLabel="This month"
        />
        <StatCard
          title="Expenses"
          value={stats.expenses}
          icon={TrendingDown}
          variant="expense"
          trendLabel="This month"
        />
        <StatCard
          title="Savings"
          value={stats.savings}
          icon={PiggyBank}
          variant="savings"
          trendLabel={`${stats.income > 0 ? Math.round((stats.savings / stats.income) * 100) : 0}% rate`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions */}
          <RecentTransactions />

          {/* Budget Overview */}
          <BudgetOverview />
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          {/* Savings Goals */}
          <SavingsGoalsOverview />

          {/* Financial Insights */}
          <FinancialInsights />
        </div>
      </div>
    </div>
  )
}
