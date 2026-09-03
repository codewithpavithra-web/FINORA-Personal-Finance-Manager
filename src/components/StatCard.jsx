import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

const EMOJI_MAP = {
  balance: '💵',
  income: '💰',
  expense: '🛒',
  savings: '🐷',
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = 'default',
}) {
  const bgColors = {
    default: 'stat-card-balance',
    income: 'stat-card-income',
    expense: 'stat-card-expense',
    balance: 'stat-card-balance',
    savings: 'stat-card-savings',
  }

  const iconColors = {
    default: 'icon-balance',
    income: 'icon-income',
    expense: 'icon-expense',
    balance: 'icon-balance',
    savings: 'icon-savings',
  }

  const trendColors = {
    up: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    down: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    neutral: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
  }

  const getTrendColor = () => {
    if (!trend) return 'neutral'
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral'
  }

  const trendColor = getTrendColor()

  return (
    <div className={`card ${bgColors[variant]} border-0 relative overflow-hidden group`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10 dark:opacity-5">
        <div className={`w-24 h-24 rounded-full blur-3xl ${iconColors[variant]}`} />
      </div>

      <div className="relative z-10">
        {/* Header with emoji and title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{EMOJI_MAP[variant] || '💵'}</span>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </h3>
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
            ₹{value.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Trend indicator */}
        {trend !== undefined && trendLabel && (
          <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${trendColors[trendColor]}`}>
            {trendColor === 'up' && <ArrowUpRight size={14} />}
            {trendColor === 'down' && <ArrowDownLeft size={14} />}
            <span>{trendLabel}</span>
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 dark:group-hover:bg-white/5 transition-all duration-300" />
    </div>
  )
}
