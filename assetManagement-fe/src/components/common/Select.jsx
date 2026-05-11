import React from 'react'

export function Select({ 
  label, 
  error, 
  options = [], 
  className = '', 
  ...props 
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-slate-900 border ${
          error ? 'border-red-500' : 'border-slate-700'
        } rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all duration-200 appearance-none cursor-pointer`}
        {...props}
      >
        <option value="" disabled className="text-slate-500">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
