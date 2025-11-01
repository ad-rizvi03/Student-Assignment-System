import React, { useEffect, useRef } from 'react'

export default function ConfirmModal({ open, title, onClose, onConfirm, children }) {
  const modalRef = useRef(null)
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    // focus cancel button when opened
    setTimeout(() => { cancelRef.current?.focus() }, 0)

    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose()
      if (e.key === 'Tab') {
        // basic focus trap
        const nodes = modalRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          ;(last).focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          ;(first).focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev && prev.focus && prev.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="presentation">
  <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="card-surface rounded-lg p-6 w-11/12 max-w-md">
        <h3 id="confirm-title" className="text-lg font-semibold mb-3">{title}</h3>
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-200">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            className="px-4 py-2 rounded border text-sm bg-transparent text-slate-800 dark:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-emerald-600 text-white text-sm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
