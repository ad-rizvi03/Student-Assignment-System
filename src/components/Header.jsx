import React, { useState, useRef, useEffect } from 'react'
import { BookOpen, Sun, Moon, ChevronDown, LogOut, LayoutGrid, LayoutList } from 'lucide-react'
import { getDisplayName, getInitials } from '../utils/user'

export default function Header({ users, currentUserId, onSwitchUser, dark, onToggleDark, layout, onToggleLayout, onNavigate }) {
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
  <header className={`mb-6 p-4 rounded-2xl transition-all bg-pine text-white shadow-soft-lg`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full header-badge" style={{ background: 'var(--bronze)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <div className="font-bold text-lg text-white">Student Assignment System</div>
              <div className="text-sm opacity-90 text-white/90">Manage assignments & submissions</div>
            </div>
          </div>

        <div className="flex items-center gap-3">
          {/* removed duplicate middle profile switcher to avoid visual duplication; use profile menu on the right to switch users */}

          <div className="hidden sm:flex items-center gap-2 rounded px-2 py-1">
            <button onClick={() => onNavigate && onNavigate('courses')} title="Courses" className="px-3 py-2 rounded bg-bronze/10 text-bronze">Courses</button>
            <button
              aria-pressed={layout === 'grid'}
              onClick={() => onToggleLayout && onToggleLayout('grid')}
              title="Grid layout"
              className={`p-2 rounded transition-transform duration-150 transform hover:scale-105 ${layout === 'grid' ? (dark ? 'bg-slate-200 dark:bg-slate-600 text-slate-800' : 'bg-bronze text-white') : (dark ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700' : 'text-bronze hover:bg-bronze/10')}`}>
              <LayoutGrid size={16} />
            </button>
            <button
              aria-pressed={layout === 'list'}
              onClick={() => onToggleLayout && onToggleLayout('list')}
              title="List layout"
              className={`p-2 rounded transition-transform duration-150 transform hover:scale-105 ${layout === 'list' ? (dark ? 'bg-slate-200 dark:bg-slate-600 text-slate-800' : 'bg-bronze text-white') : (dark ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700' : 'text-bronze hover:bg-bronze/10')}`}>
              <LayoutList size={16} />
            </button>
          </div>

          {/* mobile layout toggle (visible on small screens) */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              aria-pressed={layout === 'grid'}
              onClick={() => onToggleLayout && onToggleLayout('grid')}
              title="Grid layout"
              className={`p-2 rounded transition-transform duration-150 transform hover:scale-105 btn-bronze bronze-shimmer ${layout === 'grid' ? '' : 'opacity-90'}`}>
              <LayoutGrid size={16} />
            </button>
            <button
              aria-pressed={layout === 'list'}
              onClick={() => onToggleLayout && onToggleLayout('list')}
              title="List layout"
              className={`p-2 rounded transition-transform duration-150 transform hover:scale-105 btn-bronze bronze-shimmer ${layout === 'list' ? '' : 'opacity-90'}`}>
              <LayoutList size={16} />
            </button>
          </div>

          <button
            onClick={onToggleDark}
            className={dark ? 'px-3 py-2 rounded bg-white/80 dark:bg-slate-700/60 transition' : 'px-3 py-2 rounded bg-bronze text-white transition hover:bg-bronze/90'}
            aria-label="Toggle theme">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="relative" ref={ref}>
            <button onClick={() => setOpen(o => !o)} className={dark ? 'flex items-center gap-3 px-3 py-2 rounded bg-white/80 dark:bg-slate-700/60' : 'flex items-center gap-3 px-3 py-2 rounded bg-bronze text-white'}>
              <div className="text-sm">{(current && getDisplayName(current)) || 'Guest'}</div>
              <div className="w-9 h-9 rounded-full header-badge text-sm font-medium" style={{ background: dark ? 'var(--header-badge-bg)' : 'rgba(255,255,255,0.9)', color: dark ? 'var(--header-badge-fg)' : 'var(--taupe)' }}>{getInitials(current) || 'G'}</div>
              <ChevronDown size={14} className={dark ? 'text-slate-200' : 'text-white'} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg dark:bg-slate-800 z-50 text-taupe dark:text-white">
                <div className="p-2">
                  {users.map(u => {
                    const display = getDisplayName(u)
                    return (
                      <div key={u.id} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between" onClick={() => { onSwitchUser(u.id); setOpen(false) }}>
                        <div className="text-sm">{display}</div>
                        <div className="text-xs text-muted text-slate-500 dark:text-slate-400">{`(${u.role})`}</div>
                      </div>
                    )
                  })}
                  <div className="border-t mt-2 pt-2">
                    <div className="p-2 flex items-center gap-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => { onSwitchUser && onSwitchUser(null); setOpen(false) }}>
                      <LogOut size={14} />
                      <span className="text-sm">Logout</span>
                    </div>
                    <div className="p-2 mt-2 flex items-center gap-2 rounded hover:bg-red-50 dark:hover:bg-red-800 cursor-pointer text-rose-600" onClick={() => { if (onResetDemo) onResetDemo(); setOpen(false) }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-sm">Reset demo data</span>
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
