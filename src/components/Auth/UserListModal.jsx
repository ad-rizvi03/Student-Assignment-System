import React, { useState, useRef, useEffect } from 'react'

export default function UserListModal({ open, onClose, users = [], onSelect }) {
  const [activeId, setActiveId] = useState(null)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (activeId && inputRef.current) inputRef.current.focus()
  }, [activeId])

  if (!open) return null

  const trySelect = (u) => {
    // fallback to requested default password for older/mock users
    const expected = u.password || '123456789'
    if (pw === expected) {
      setErr(null)
      setActiveId(null)
      setPw('')
      onSelect && onSelect(u)
    } else {
      setErr('Incorrect password')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-2xl mx-4 p-4 transform transition-all duration-200 opacity-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Registered users</h3>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>

        <div className="grid gap-2">
          {users.map(u => {
            // robust display name/handle fallback: data may use `fullName`, `name`, `username` or only `id`
            const displayName = u.fullName || u.name || u.displayName || u.username || u.id
            const handle = u.username || (u.name ? u.name.replace(/\s+/g, '').toLowerCase() : u.id)
            return (
              <div key={u.id} className="p-0">
                <div
                  className={`flex items-center justify-between p-3 rounded ${activeId === u.id ? 'bg-slate-50 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700'} cursor-pointer transition shadow-sm`}
                  onClick={() => { setActiveId(u.id); setErr(null); setPw('') }}
                >
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">{displayName}</div>
                    <div className="text-xs text-slate-500">@{handle} • <span className="capitalize">{u.role}</span></div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded ${u.role === 'admin' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.role === 'admin' ? 'Admin' : 'Student'}</span>
                  </div>
                </div>

                {activeId === u.id && (
                  <div className="mt-2 px-3">
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="password"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        placeholder="Enter password"
                        className="flex-1 border p-2 rounded bg-white text-black"
                        onKeyDown={(e) => { if (e.key === 'Enter') trySelect(u) }}
                      />
                      <button onClick={() => trySelect(u)} className="px-3 py-2 bg-sky-600 text-white rounded">Sign in</button>
                      <button onClick={() => { setActiveId(null); setPw(''); setErr(null) }} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded">Cancel</button>
                    </div>
                    {err && <div className="text-xs text-red-600 mt-1">{err}</div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
