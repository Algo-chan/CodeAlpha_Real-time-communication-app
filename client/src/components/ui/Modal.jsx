import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className={`relative w-full ${maxWidth} glass-panel rounded-card bg-surface/90 shadow-floating dark:shadow-floating-dark border border-separator/50 overflow-hidden z-10 flex flex-col`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 pb-4 border-b border-separator/30">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-title-2 text-label">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-footnote text-label-secondary mt-1">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="text-label-secondary hover:text-label -mr-1"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 px-6 border-t border-separator/30 bg-surface-elevated/40 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
