/**
 * Calculate budget status from transactions
 * @param {Object} budget - Budget object with category and monthlyLimit
 * @param {Array} transactions - Array of transaction objects
 * @param {String} period - Budget period: 'weekly', 'monthly', or 'yearly'
 * @returns {Object} Budget status with spent, remaining, percentage, etc.
 */
export function calculateBudgetStatus(budget, transactions, period = 'monthly') {
  const spent = calculateBudgetSpent(budget.category, transactions, period)
  const monthlyLimit = budget.monthlyLimit || 0
  const percentage = monthlyLimit > 0 ? Math.round((spent / monthlyLimit) * 100) : 0
  const remaining = Math.max(0, monthlyLimit - spent)
  const exceeded = Math.max(0, spent - monthlyLimit)

  let status = 'safe'
  if (percentage > 100) {
    status = 'exceeded'
  } else if (percentage >= 90) {
    status = 'critical'
  } else if (percentage >= 70) {
    status = 'warning'
  }

  return {
    spent,
    percentage,
    remaining,
    exceeded,
    status,
  }
}

/**
 * Calculate total spent for a budget category
 * @param {String} category - Category name
 * @param {Array} transactions - Array of transaction objects
 * @param {String} period - 'weekly', 'monthly', or 'yearly'
 * @returns {Number} Total spent amount
 */
export function calculateBudgetSpent(category, transactions, period = 'monthly') {
  const now = new Date()
  let startDate, endDate

  switch (period) {
    case 'weekly': {
      // Get start of current week (Monday)
      const day = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
      startDate = new Date(now.getFullYear(), now.getMonth(), day)
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      break
    }
    case 'yearly': {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear() + 1, 0, 1)
      break
    }
    case 'monthly':
    default: {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      break
    }
  }

  return transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category === category &&
        new Date(t.date) >= startDate &&
        new Date(t.date) < endDate
    )
    .reduce((sum, t) => sum + (t.amount || 0), 0)
}

/**
 * Get status badge info (icon, text, color class)
 */
export function getStatusBadge(status) {
  const badges = {
    safe: {
      emoji: '🟢',
      text: 'On Track',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400',
    },
    warning: {
      emoji: '🟡',
      text: 'Approaching Limit',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-400',
    },
    critical: {
      emoji: '🟠',
      text: 'Almost Exceeded',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-400',
    },
    exceeded: {
      emoji: '🔴',
      text: 'Over Budget',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-400',
    },
  }

  return badges[status] || badges.safe
}

/**
 * Get progress bar color class based on status
 */
export function getProgressColor(status) {
  const colors = {
    safe: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500',
  }

  return colors[status] || colors.safe
}

/**
 * Get alert message based on budget status
 */
export function getAlertMessage(budget, budgetStatus) {
  const { spent, percentage, exceeded } = budgetStatus
  const formattedSpent = spent.toLocaleString('en-IN')
  const formattedExceeded = exceeded.toLocaleString('en-IN')

  if (percentage > 100) {
    return `🔴 ${budget.category} budget exceeded. You have exceeded your budget by ₹${formattedExceeded}.`
  } else if (percentage >= 90) {
    return `🟠 ${budget.category} budget is almost reached. You have used ${percentage}% of your budget.`
  } else if (percentage >= 70) {
    return `🟡 ${budget.category} budget is approaching its limit. You have used ${percentage}% of your budget.`
  } else {
    return `🟢 Great job! You are staying within your ${budget.category} budget.`
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}
