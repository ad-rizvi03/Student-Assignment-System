import React from 'react'

export default function Toast({ message, actionLabel = 'Undo', onAction, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center bg-gray-900 text-white px-4 py-3 rounded shadow-lg">
        <div className="mr-4">{message}</div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-white text-gray-900 dark:bg-slate-700 dark:text-white px-3 py-1 rounded mr-2 text-sm"
          >
            {actionLabel}
          </button>
        )}
        <button onClick={onClose} className="text-sm opacity-70">✕</button>
      </div>
    </div>
  )
}
