import React from 'react'

export default function ProgressBar({ percent = 0 }) {
  const p = Math.max(0, Math.min(100, percent))
  const colorClass = p >= 100 ? 'bg-pine' : p > 0 ? 'bg-pine/80' : 'bg-bronze/60'
  return (
    <div className="w-full bg-bronze/10 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${colorClass}`}
        style={{ width: `${p}%`, transition: 'width 300ms ease' }}
      />
    </div>
  )
}
