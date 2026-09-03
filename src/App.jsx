import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FinanceProvider } from './context/FinanceContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Savings from './pages/Savings'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  )
}

export default App
