import React from 'react'

export default function ProgressBar({ percent = 0 }) {
  const p = Math.max(0, Math.min(100, percent))
  const colorClass = p >= 100 ? 'bg-emerald-500' : p > 0 ? 'bg-amber-400' : 'bg-rose-400'
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${colorClass}`}
        style={{ width: `${p}%`, transition: 'width 300ms ease' }}
      />
    </div>
  )
}
