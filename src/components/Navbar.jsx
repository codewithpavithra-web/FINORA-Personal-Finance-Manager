import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search, X } from 'lucide-react'
import { useFinance } from '../context/FinanceContext'
import Avatar from './Avatar'

const pageNames = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/savings': 'Savings Goals',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

export default function Navbar({ onMenuClick }) {
  const location = useLocation()
  const { profile } = useFinance()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const pageName = pageNames[location.pathname] || 'Dashboard'

  const notifications = [
    { id: 1, message: 'You are close to your Food budget.', type: 'warning' },
    { id: 2, message: 'Monthly savings goal is 72% complete.', type: 'info' },
    { id: 3, message: 'Salary received.', type: 'success' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-soft">
      <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="
              md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700
              rounded-lg transition-colors duration-150
              touch-target
              focus-visible:ring-2 focus-visible:ring-primary-500
            "
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
            {pageName}
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search (hidden on mobile for now) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="
                p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg
                relative transition-colors duration-150
                touch-target
                focus-visible:ring-2 focus-visible:ring-primary-500
              "
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-glow" />
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="
                absolute right-0 mt-2 w-full sm:w-80 max-w-sm
                bg-white dark:bg-slate-800
                rounded-xl shadow-xl border border-slate-200 dark:border-slate-700
                z-50 animate-slide-in
                max-h-96
              ">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="
                      p-1 hover:bg-slate-100 dark:hover:bg-slate-700
                      rounded-lg transition-colors duration-150
                      md:hidden
                      touch-target
                    "
                    aria-label="Close notifications"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="
                        p-4 border-b border-slate-100 dark:border-slate-700
                        hover:bg-slate-50 dark:hover:bg-slate-700/50
                        cursor-pointer transition-colors duration-150
                      "
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <Avatar name={profile.name} avatar={profile.avatar} />
        </div>
      </div>
    </nav>
  )
}
