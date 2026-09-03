import { createContext, useContext, useState, useEffect } from 'react'

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savingsGoals, setSavingsGoals] = useState([])
  const [profile, setProfile] = useState({
    name: 'User',
    email: 'user@example.com',
    currency: 'INR',
    monthlyIncome: 50000,
    financialGoal: 'Build emergency fund',
    avatar: 'initials',
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finora_transactions')
    const savedBudgets = localStorage.getItem('finora_budgets')
    const savedGoals = localStorage.getItem('finora_savings_goals')
    const savedProfile = localStorage.getItem('finora_profile')

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else {
      // Initialize with sample data if no saved data
      setTransactions(getInitialTransactions())
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    } else {
      setBudgets(getInitialBudgets())
    }

    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals))
    } else {
      setSavingsGoals(getInitialSavingsGoals())
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('finora_transactions', JSON.stringify(transactions))
  }, [transactions])

  // Save budgets to localStorage
  useEffect(() => {
    localStorage.setItem('finora_budgets', JSON.stringify(budgets))
  }, [budgets])

  // Save savings goals to localStorage
  useEffect(() => {
    localStorage.setItem('finora_savings_goals', JSON.stringify(savingsGoals))
  }, [savingsGoals])

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('finora_profile', JSON.stringify(profile))
  }, [profile])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      createdAt: new Date().toISOString(),
    }
    setTransactions([...transactions, newTransaction])
    return newTransaction
  }

  const updateTransaction = (id, updatedData) => {
    setTransactions(
      transactions.map(t => t.id === id ? { ...t, ...updatedData } : t)
    )
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const addBudget = (budget) => {
    const newBudget = {
      id: Date.now(),
      ...budget,
      createdAt: new Date().toISOString(),
    }
    setBudgets([...budgets, newBudget])
    return newBudget
  }

  const updateBudget = (id, updatedData) => {
    setBudgets(
      budgets.map(b => b.id === id ? { ...b, ...updatedData } : b)
    )
  }

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id))
  }

  const addSavingsGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      saved: goal.saved || 0,
      createdAt: new Date().toISOString(),
    }
    setSavingsGoals([...savingsGoals, newGoal])
    return newGoal
  }

  const updateSavingsGoal = (id, updatedData) => {
    setSavingsGoals(
      savingsGoals.map(g => g.id === id ? { ...g, ...updatedData } : g)
    )
  }

  const deleteSavingsGoal = (id) => {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id))
  }

  const updateProfile = (updatedProfile) => {
    setProfile({ ...profile, ...updatedProfile })
  }

  const calculateIncome = (startDate, endDate) => {
    return transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return t.type === 'income' && tDate >= startDate && tDate <= endDate
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const calculateExpenses = (startDate, endDate) => {
    return transactions
      .filter(t => {
        const tDate = new Date(t.date)
        return t.type === 'expense' && tDate >= startDate && tDate <= endDate
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const calculateBalance = () => {
    return transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount
    }, 0)
  }

  const calculateSavings = (startDate, endDate) => {
    const income = calculateIncome(startDate, endDate)
    const expenses = calculateExpenses(startDate, endDate)
    return Math.max(0, income - expenses)
  }

  // Bulk import methods
  const importData = (data) => {
    if (data.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions)
    }
    if (data.budgets && Array.isArray(data.budgets)) {
      setBudgets(data.budgets)
    }
    if (data.savingsGoals && Array.isArray(data.savingsGoals)) {
      setSavingsGoals(data.savingsGoals)
    }
    if (data.profile && typeof data.profile === 'object') {
      setProfile(data.profile)
    }
  }

  const clearAllData = () => {
    setTransactions([])
    setBudgets([])
    setSavingsGoals([])
    setProfile({
      name: 'User',
      email: 'user@example.com',
      currency: 'INR',
      monthlyIncome: 50000,
      financialGoal: 'Build emergency fund',
      avatar: 'initials',
    })
  }

  const value = {
    // Transactions
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    // Budgets
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,

    // Savings Goals
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,

    // Profile
    profile,
    updateProfile,

    // Calculations
    calculateIncome,
    calculateExpenses,
    calculateBalance,
    calculateSavings,

    // Import/Export
    importData,
    clearAllData,
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}

// Initial sample data
function getInitialTransactions() {
  const today = new Date()
  return [
    {
      id: 1,
      type: 'income',
      title: 'Salary',
      amount: 45000,
      category: 'Salary',
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly salary',
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: 'expense',
      title: 'Groceries',
      amount: 2500,
      category: 'Food',
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Credit Card',
      notes: 'Weekly groceries',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: 'expense',
      title: 'Netflix',
      amount: 649,
      category: 'Entertainment',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Credit Card',
      notes: 'Monthly subscription',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: 'expense',
      title: 'Electricity Bill',
      amount: 1200,
      category: 'Bills',
      date: today.toISOString(),
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly electricity',
      createdAt: today.toISOString(),
    },
    {
      id: 5,
      type: 'expense',
      title: 'Coffee',
      amount: 150,
      category: 'Food',
      date: today.toISOString(),
      paymentMethod: 'Cash',
      notes: 'Morning coffee',
      createdAt: today.toISOString(),
    },
  ]
}

function getInitialBudgets() {
  return [
    {
      id: 1,
      category: 'Food',
      monthlyLimit: 8000,
      period: 'monthly',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      category: 'Entertainment',
      monthlyLimit: 2000,
      period: 'monthly',
      createdAt: new Date().toISOString(),
    },
  ]
}

function getInitialSavingsGoals() {
  return [
    {
      id: 1,
      title: 'New Laptop',
      targetAmount: 80000,
      saved: 42000,
      dueDate: new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '💻',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Vacation',
      targetAmount: 100000,
      saved: 35000,
      dueDate: new Date(new Date().getTime() + 270 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '✈️',
      createdAt: new Date().toISOString(),
    },
  ]
}
