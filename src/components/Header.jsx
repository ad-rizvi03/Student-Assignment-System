import React, { useState, useRef, useEffect } from 'react'
import { BookOpen, Sun, Moon, ChevronDown, LogOut, LayoutGrid, LayoutList } from 'lucide-react'

export default function Header({ users, currentUserId, onSwitchUser, dark, onToggleDark, layout, onToggleLayout }) {
  const current = users.find(u => u.id === currentUserId)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <header className={`mb-6 p-4 rounded-2xl transition-all`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full header-badge">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="font-bold text-lg text-slate-800 dark:text-white">Student Assignment System</div>
            <div className="text-sm opacity-80 text-slate-600 dark:text-slate-300">Manage assignments & submissions</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* removed duplicate middle profile switcher to avoid visual duplication; use profile menu on the right to switch users */}

          <div className="hidden sm:flex items-center gap-2 bg-white/80 dark:bg-transparent rounded px-2 py-1">
            <button aria-pressed={layout === 'grid'} onClick={() => onToggleLayout && onToggleLayout()} title="Grid layout" className={`p-2 rounded ${layout === 'grid' ? 'bg-slate-200 dark:bg-slate-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700'} transition-transform duration-150 transform hover:scale-105`}>
              <LayoutGrid size={16} />
            </button>
            <button aria-pressed={layout === 'list'} onClick={() => onToggleLayout && onToggleLayout()} title="List layout" className={`p-2 rounded ${layout === 'list' ? 'bg-slate-200 dark:bg-slate-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700'} transition-transform duration-150 transform hover:scale-105`}>
              <LayoutList size={16} />
            </button>
          </div>

          <button onClick={onToggleDark} className="px-3 py-2 rounded bg-white/80 dark:bg-slate-700/60 transition" aria-label="Toggle theme">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 px-3 py-2 rounded bg-white/80 dark:bg-slate-700/60">
              <div className="text-sm text-slate-800 dark:text-white">{current?.name}</div>
              <div className="w-9 h-9 rounded-full header-badge text-sm font-medium">{current?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <ChevronDown size={14} className="text-slate-700 dark:text-slate-200" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg dark:bg-slate-800 z-50">
                <div className="p-2">
                  {users.map(u => (
                    <div key={u.id} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => { onSwitchUser(u.id); setOpen(false) }}>{u.name} <span className="text-xs text-slate-500">({u.role})</span></div>
                  ))}
                  <div className="border-t mt-2 pt-2">
                    <div className="p-2 flex items-center gap-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => { onSwitchUser && onSwitchUser(null); setOpen(false) }}>
                      <LogOut size={14} />
                      <span className="text-sm">Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
