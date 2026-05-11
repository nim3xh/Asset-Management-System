import React from 'react'
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { Button } from './Button'

export function DataTable({ 
  columns, 
  data, 
  isLoading, 
  pagination, 
  onPageChange,
  onEdit,
  onDelete
}) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-2/3" />
                    </td>
                  ))}
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded ml-auto w-12" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-800/20 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-slate-300 text-sm">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
              {(onEdit || onDelete || item.actions) && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.actions && item.actions(item)}
                    {onEdit && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit(item)}
                            className="!p-2 hover:text-blue-400"
                          >
                            <Edit2 size={16} />
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onDelete(item)}
                            className="!p-2 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-300 font-medium">{pagination.currentPage * pagination.pageSize + 1}</span> to{' '}
            <span className="text-slate-300 font-medium">
              {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}
            </span> of{' '}
            <span className="text-slate-300 font-medium">{pagination.totalElements}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage === 0 || isLoading}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    pagination.currentPage === i
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages - 1 || isLoading}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
