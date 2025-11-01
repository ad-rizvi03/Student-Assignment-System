import React, { useEffect, useRef } from 'react'
import { Paperclip, Calendar } from 'lucide-react'

export default function AssignmentDrawer({ open, assignment, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    setTimeout(() => {
      // focus close button or first focusable
      const btn = panelRef.current?.querySelector('button, a, input, textarea, select')
      btn?.focus()
    }, 0)

    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose()
      if (e.key === 'Tab') {
        const nodes = panelRef.current.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
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

  if (!open || !assignment) return null
  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <div className="flex-1" onClick={onClose} />
  <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="drawer-title" className="w-full md:w-1/3 card-surface p-6 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 id="drawer-title" className="text-lg font-semibold">{assignment.title}</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>
  <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{assignment.description}</p>
        <div className="mt-4">
          <div className="text-sm text-gray-500">Due date</div>
          <div className="font-medium"><Calendar size={16} className="inline-block mr-2" />{assignment.dueDate}</div>
        </div>
        {assignment.driveLink && (
          <div className="mt-4">
            <a href={assignment.driveLink} target="_blank" rel="noreferrer" className="text-sky-600"><Paperclip size={14} className="inline-block mr-2" />Open Drive link</a>
          </div>
        )}
      </div>
    </div>
  )
}
