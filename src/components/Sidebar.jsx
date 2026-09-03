import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  User,
  Settings,
  X,
} from 'lucide-react'

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', emoji: '📊' },
  { icon: Wallet, label: 'Transactions', path: '/transactions', emoji: '💳' },
  { icon: Target, label: 'Budgets', path: '/budgets', emoji: '📈' },
  { icon: TrendingUp, label: 'Savings Goals', path: '/savings', emoji: '🎯' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', emoji: '📉' },
  { icon: FileText, label: 'Reports', path: '/reports', emoji: '📊' },
]

const bottomItems = [
  { icon: User, label: 'Profile', path: '/profile', emoji: '👤' },
  { icon: Settings, label: 'Settings', path: '/settings', emoji: '⚙️' },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white dark:bg-slate-800
          border-r border-slate-200 dark:border-slate-700
          flex flex-col
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">FINORA</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Personal Finance
              </p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 font-medium
                  ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-soft'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-700/30'
                  }
                `}
              >
                <span className="text-xl">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-2">
          {bottomItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 font-medium
                  ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-soft'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-700/30'
                  }
                `}
              >
                <span className="text-xl">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
