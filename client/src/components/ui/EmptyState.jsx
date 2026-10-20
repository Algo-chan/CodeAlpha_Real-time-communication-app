import React from 'react'
import { Button } from './Button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center text-label-secondary mb-4 ring-1 ring-separator/30">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-title-2 text-label font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-footnote text-label-secondary leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
