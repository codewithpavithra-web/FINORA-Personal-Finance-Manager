import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

const EXPENSE_CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Education', 'Health', 'Other']
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other']

export default function TransactionFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleTypeChange = (type) => {
    if (type === filters.type) {
      onFilterChange({ ...filters, type: 'all' })
    } else {
      onFilterChange({ ...filters, type, category: 'all' })
    }
    setOpenDropdown(null)
  }

  const handleCategoryChange = (category) => {
    if (category === filters.category) {
      onFilterChange({ ...filters, category: 'all' })
    } else {
      onFilterChange({ ...filters, category })
    }
    setOpenDropdown(null)
  }

  const handleDateChange = (dateRange) => {
    if (dateRange === filters.dateRange) {
      onFilterChange({ ...filters, dateRange: 'all' })
    } else {
      onFilterChange({ ...filters, dateRange })
    }
    setOpenDropdown(null)
  }

  const handleSortChange = (sortBy) => {
    onFilterChange({ ...filters, sortBy })
    setOpenDropdown(null)
  }

  const getCategories = () => {
    if (filters.type === 'income') return INCOME_CATEGORIES
    if (filters.type === 'expense') return EXPENSE_CATEGORIES
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  }

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.sortBy !== 'newest'

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-soft dark:shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            🔍 Filters & Sort
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 transition-colors touch-target"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Grid of filters with overflow handling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 overflow-visible">
          {/* Type Filter */}
          <div className="relative z-20">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className="
                w-full px-3 py-2.5 sm:py-2
                bg-slate-50 dark:bg-slate-700
                border border-slate-200 dark:border-slate-600
                rounded-lg text-sm font-medium
                text-slate-900 dark:text-slate-50
                hover:bg-slate-100 dark:hover:bg-slate-600
                transition-all duration-150
                flex items-center justify-between
                touch-target
                focus-visible:ring-2 focus-visible:ring-primary-500
              "
            >
              <span className="truncate">
                {filters.type === 'all'
                  ? 'All Types'
                  : filters.type === 'income'
                    ? 'Income'
                    : 'Expense'}
              </span>
              <ChevronDown
                size={16}
                className={`
                  transition-transform duration-200 flex-shrink-0 ml-2
                  ${openDropdown === 'type' ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* Dropdown */}
            {openDropdown === 'type' && (
              <div className="
                absolute top-full left-0 right-0 mt-2
                bg-white dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                rounded-lg shadow-xl z-50
                overflow-hidden
                animate-slide-in
              ">
                <button
                  onClick={() => handleTypeChange('all')}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    transition-colors duration-150
                    first:rounded-t-lg
                    ${
                      filters.type === 'all'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  All Types
                </button>
                <button
                  onClick={() => handleTypeChange('income')}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    transition-colors duration-150
                    ${
                      filters.type === 'income'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  💰 Income
                </button>
                <button
                  onClick={() => handleTypeChange('expense')}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    transition-colors duration-150
                    last:rounded-b-lg
                    ${
                      filters.type === 'expense'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  💸 Expense
                </button>
              </div>
            )}
          </div>

        {/* Category Filter */}
        <div className="relative z-19">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
            className="
              w-full px-3 py-2.5 sm:py-2
              bg-slate-50 dark:bg-slate-700
              border border-slate-200 dark:border-slate-600
              rounded-lg text-sm font-medium
              text-slate-900 dark:text-slate-50
              hover:bg-slate-100 dark:hover:bg-slate-600
              transition-all duration-150
              flex items-center justify-between
              touch-target
              focus-visible:ring-2 focus-visible:ring-primary-500
            "
          >
            <span className="truncate">
              {filters.category === 'all' ? 'All Categories' : filters.category}
            </span>
            <ChevronDown
              size={16}
              className={`
                transition-transform duration-200 flex-shrink-0 ml-2
                ${openDropdown === 'category' ? 'rotate-180' : ''}
              `}
            />
          </button>

          {/* Dropdown */}
          {openDropdown === 'category' && (
            <div className="
              absolute top-full left-0 right-0 mt-2
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              rounded-lg shadow-xl z-50
              max-h-64 overflow-y-auto
              animate-slide-in
            ">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  first:rounded-t-lg
                  ${
                    filters.category === 'all'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                All Categories
              </button>
              {getCategories().map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`
                    w-full px-4 py-3 text-left text-sm
                    hover:bg-slate-50 dark:hover:bg-slate-700
                    transition-colors duration-150
                    ${
                      filters.category === cat
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="relative z-18">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            className="
              w-full px-3 py-2.5 sm:py-2
              bg-slate-50 dark:bg-slate-700
              border border-slate-200 dark:border-slate-600
              rounded-lg text-sm font-medium
              text-slate-900 dark:text-slate-50
              hover:bg-slate-100 dark:hover:bg-slate-600
              transition-all duration-150
              flex items-center justify-between
              touch-target
              focus-visible:ring-2 focus-visible:ring-primary-500
            "
          >
            <span className="truncate">
              {filters.dateRange === 'all'
                ? 'All Dates'
                : filters.dateRange === 'today'
                  ? 'Today'
                  : filters.dateRange === 'week'
                    ? 'This Week'
                    : filters.dateRange === 'month'
                      ? 'This Month'
                      : filters.dateRange === 'quarter'
                        ? 'This Quarter'
                        : 'This Year'}
            </span>
            <ChevronDown
              size={16}
              className={`
                transition-transform duration-200 flex-shrink-0 ml-2
                ${openDropdown === 'date' ? 'rotate-180' : ''}
              `}
            />
          </button>

          {/* Dropdown */}
          {openDropdown === 'date' && (
            <div className="
              absolute top-full left-0 right-0 mt-2
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              rounded-lg shadow-xl z-50
              max-h-64 overflow-y-auto
              animate-slide-in
            ">
              <button
                onClick={() => handleDateChange('all')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  first:rounded-t-lg
                  ${
                    filters.dateRange === 'all'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                All Dates
              </button>
              <button
                onClick={() => handleDateChange('today')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.dateRange === 'today'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                Today
              </button>
              <button
                onClick={() => handleDateChange('week')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.dateRange === 'week'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                This Week
              </button>
              <button
                onClick={() => handleDateChange('month')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.dateRange === 'month'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                This Month
              </button>
              <button
                onClick={() => handleDateChange('quarter')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.dateRange === 'quarter'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                This Quarter
              </button>
              <button
                onClick={() => handleDateChange('year')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  last:rounded-b-lg
                  ${
                    filters.dateRange === 'year'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                This Year
              </button>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative z-17">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="
              w-full px-3 py-2.5 sm:py-2
              bg-slate-50 dark:bg-slate-700
              border border-slate-200 dark:border-slate-600
              rounded-lg text-sm font-medium
              text-slate-900 dark:text-slate-50
              hover:bg-slate-100 dark:hover:bg-slate-600
              transition-all duration-150
              flex items-center justify-between
              touch-target
              focus-visible:ring-2 focus-visible:ring-primary-500
            "
          >
            <span className="truncate">
              {filters.sortBy === 'newest'
                ? 'Newest First'
                : filters.sortBy === 'oldest'
                  ? 'Oldest First'
                  : filters.sortBy === 'highest'
                    ? 'Highest Amount'
                    : 'Lowest Amount'}
            </span>
            <ChevronDown
              size={16}
              className={`
                transition-transform duration-200 flex-shrink-0 ml-2
                ${openDropdown === 'sort' ? 'rotate-180' : ''}
              `}
            />
          </button>

          {/* Dropdown */}
          {openDropdown === 'sort' && (
            <div className="
              absolute top-full left-0 right-0 mt-2
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              rounded-lg shadow-xl z-50
              max-h-64 overflow-y-auto
              animate-slide-in
            ">
              <button
                onClick={() => handleSortChange('newest')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  first:rounded-t-lg
                  ${
                    filters.sortBy === 'newest'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                Newest First
              </button>
              <button
                onClick={() => handleSortChange('oldest')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.sortBy === 'oldest'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                Oldest First
              </button>
              <button
                onClick={() => handleSortChange('highest')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  ${
                    filters.sortBy === 'highest'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                Highest Amount
              </button>
              <button
                onClick={() => handleSortChange('lowest')}
                className={`
                  w-full px-4 py-3 text-left text-sm
                  hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-150
                  last:rounded-b-lg
                  ${
                    filters.sortBy === 'lowest'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                Lowest Amount
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="font-medium">Active filters:</span> {filters.type !== 'all' && `${filters.type} • `}
          {filters.category !== 'all' && `${filters.category} • `}
          {filters.dateRange !== 'all' && `${filters.dateRange} • `}
          {filters.sortBy !== 'newest' && `Sorted by ${filters.sortBy}`}
        </div>
      )}
    </div>

    </div>
  )
}
