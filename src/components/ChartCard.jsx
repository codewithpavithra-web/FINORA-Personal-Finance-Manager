export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  className = '',
}) {
  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
