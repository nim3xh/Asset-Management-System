import React from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md'
}) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full ${sizes[size]} bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-1 rounded-full">
            <X size={20} />
          </Button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 border-t border-slate-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
