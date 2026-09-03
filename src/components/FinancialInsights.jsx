import { useEffect, useState, useMemo } from 'react'
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import ChartCard from './ChartCard'

export default function FinancialInsights() {
  const { transactions, budgets, savingsGoals, calculateIncome, calculateExpenses } =
    useFinance()
  const [insights, setInsights] = useState([])

  // Calculate budget status using period logic
  const getBudgetDateRange = (period) => {
    const today = new Date()
    let startDate, endDate

    switch (period) {
      case 'weekly':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - today.getDay())
        endDate = today
        break
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = today
        break
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }
    return { startDate, endDate }
  }

  const insights_data = useMemo(() => {
    const newInsights = []

    // Get current month dates
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Calculate this month's income and expenses
    const monthlyIncome = calculateIncome(firstDayOfMonth, lastDayOfMonth)
    const monthlyExpenses = calculateExpenses(firstDayOfMonth, lastDayOfMonth)
    const monthlySavings = monthlyIncome - monthlyExpenses
    const savingsRate =
      monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0

    // Get last month for comparison
    const firstDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    )
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    const lastMonthExpenses = calculateExpenses(firstDayLastMonth, lastDayLastMonth)

    // Insight 1: Savings rate
    if (savingsRate > 0) {
      newInsights.push({
        id: 1,
        icon: Award,
        type: 'success',
        title: 'Excellent Savings Rate',
        message: `Your savings rate this month is ${savingsRate}%. Keep up the great work!`,
      })
    }

    // Insight 2: Spending trends
    if (lastMonthExpenses > 0 && monthlyExpenses > lastMonthExpenses) {
      const increase = Math.round(
        ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      )
      newInsights.push({
        id: 2,
        icon: TrendingUp,
        type: 'warning',
        title: 'Spending Increase',
        message: `Your expenses increased by ${increase}% compared to last month.`,
      })
    } else if (lastMonthExpenses > 0 && monthlyExpenses < lastMonthExpenses) {
      const decrease = Math.round(
        ((lastMonthExpenses - monthlyExpenses) / lastMonthExpenses) * 100
      )
      newInsights.push({
        id: 2,
        icon: TrendingDown,
        type: 'success',
        title: 'Spending Decreased',
        message: `Great job! Your expenses decreased by ${decrease}% compared to last month.`,
      })
    }

    // Insight 3: Budget status (using period logic)
    const budgetsNearLimit = budgets.filter((b) => {
      const period = b.period || 'monthly'
      const { startDate, endDate } = getBudgetDateRange(period)
      
      const spent = transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === b.category &&
            new Date(t.date) >= startDate &&
            new Date(t.date) <= endDate
        )
        .reduce((sum, t) => sum + t.amount, 0)

      return (spent / b.monthlyLimit) > 0.8
    }).length

    if (budgetsNearLimit > 0) {
      newInsights.push({
        id: 3,
        icon: AlertCircle,
        type: 'warning',
        title: 'Budget Alerts',
        message: `You have ${budgetsNearLimit} budget${budgetsNearLimit > 1 ? 's' : ''} nearing their limits.`,
      })
    }

    // Insight 4: Top spending category
    const categorySpending = {}
    transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          new Date(t.date) >= firstDayOfMonth &&
          new Date(t.date) <= lastDayOfMonth
      )
      .forEach((t) => {
        categorySpending[t.category] =
          (categorySpending[t.category] || 0) + t.amount
      })

    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]
    if (topCategory) {
      newInsights.push({
        id: 4,
        icon: Lightbulb,
        type: 'info',
        title: 'Top Spending Category',
        message: `${topCategory[0]} is your highest expense this month at ₹${topCategory[1].toLocaleString('en-IN')}.`,
      })
    }

    // Insight 5: Savings goal progress
    const completedGoals = savingsGoals.filter(
      (g) => (g.saved / g.targetAmount) * 100 >= 100
    ).length
    const activeGoals = savingsGoals.filter(
      (g) => (g.saved / g.targetAmount) * 100 < 100
    ).length

    if (completedGoals > 0) {
      newInsights.push({
        id: 5,
        icon: Award,
        type: 'success',
        title: 'Goal Achievement',
        message: `Congratulations! You've completed ${completedGoals} savings goal${completedGoals > 1 ? 's' : ''}.`,
      })
    }

    if (activeGoals > 0 && savingsGoals.length > 0) {
      const avgProgress =
        savingsGoals.length > 0
          ? Math.round(
              savingsGoals.reduce((sum, g) => sum + Math.min((g.saved / g.targetAmount) * 100, 100), 0) /
                savingsGoals.length
            )
          : 0

      if (avgProgress > 50) {
        newInsights.push({
          id: 6,
          icon: TrendingUp,
          type: 'success',
          title: 'Goals On Track',
          message: `Your savings goals are ${avgProgress}% complete on average. Keep going!`,
        })
      }
    }

    return newInsights.slice(0, 4)
  }, [transactions, budgets, savingsGoals, calculateIncome, calculateExpenses])

  useEffect(() => {
    setInsights(insights_data)
  }, [insights_data])

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  }

  const iconColors = {
    success: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
  }

  return (
    <ChartCard title="✨ Financial Insights" subtitle="Personalized recommendations">
      {insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${bgColors[insight.type]} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${iconColors[insight.type]}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Add transactions to see insights
          </p>
        </div>
      )}
    </ChartCard>
  )
}
