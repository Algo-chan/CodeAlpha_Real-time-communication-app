import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-pill transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none'

  const sizeClasses = {
    sm: 'text-footnote px-3 py-1.5 gap-1.5 h-8',
    md: 'text-subheadline px-4 py-2 gap-2 h-10',
    lg: 'text-headline px-6 py-3 gap-2.5 h-12',
    icon: 'p-2.5 h-10 w-10 justify-center',
    'icon-sm': 'p-1.5 h-8 w-8 justify-center',
    'icon-lg': 'p-3 h-12 w-12 justify-center',
  }

  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-sm active:bg-accent-hover',
    secondary: 'bg-surface-elevated text-label border border-separator/40 hover:bg-system-gray5/50 active:bg-system-gray4/60',
    tinted: 'bg-accent-muted text-accent hover:bg-accent/20 active:bg-accent/25',
    destructive: 'bg-system-destructive text-white hover:opacity-90 active:opacity-100 shadow-sm',
    'destructive-tinted': 'bg-system-destructive-muted text-system-destructive hover:bg-system-destructive/20 active:bg-system-destructive/25',
    ghost: 'bg-transparent text-label hover:bg-surface-elevated active:bg-system-gray5/50',
    glass: 'glass-panel text-label hover:bg-surface-overlay active:bg-surface-elevated shadow-sm',
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'
