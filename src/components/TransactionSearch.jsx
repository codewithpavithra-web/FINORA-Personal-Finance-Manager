import { Search, X } from 'lucide-react'

export default function TransactionSearch({ value, onChange, onClear }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder="Search by description, category, or payment method..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-12 pr-10 w-full"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
