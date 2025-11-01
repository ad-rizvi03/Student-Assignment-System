import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function LoginView({ users = [], onLogin, onCreateUser, dark = false, onToggleDark }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('admin')
  const [activeId, setActiveId] = useState(null)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (activeId && inputRef.current) inputRef.current.focus()
  }, [activeId])

  function handleLoginAs(u) {
    // open password prompt for this user
    setActiveId(u.id)
    setPw('')
    setErr(null)
  }

  function trySignIn(u) {
    const expected = u.password || '123456789'
    if (pw === expected) {
      setErr(null)
      setActiveId(null)
      setPw('')
      onLogin && onLogin(u.id)
    } else {
      setErr('Incorrect password')
    }
  }

  const [createPassword, setCreatePassword] = useState('')
  function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    // create a simple id
    const id = `u_${Date.now()}`
    const newUser = { id, name: name.trim(), role, password: createPassword || '' }
    onCreateUser && onCreateUser(newUser)
    setName('')
    setCreatePassword('')
  }

  return (
    <div className="mt-12 p-6 rounded-lg card-surface">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Welcome — please sign in</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Choose your account to continue. In this demo you can sign in as an existing teacher (admin) or student, or create a new teacher account.</p>
        </div>
        <div className="ml-4 mt-1">
          <button onClick={() => onToggleDark && onToggleDark()} title="Toggle theme" className="p-2 rounded bg-white/80 dark:bg-slate-700/60">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 mb-4">
        {users.map(u => (
          <div key={u.id} className="mb-2">
            <div className="text-left p-3 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" onClick={() => handleLoginAs(u)}>
              <div className="font-medium">{u.name || u.fullName || u.username || u.id}</div>
              <div className="text-xs text-slate-500">{u.role}</div>
            </div>
            {activeId === u.id && (
              <div className="mt-2 flex gap-2 items-center">
                <input ref={inputRef} type="password" value={pw} onChange={e => setPw(e.target.value)} className="flex-1 border p-2 rounded bg-white text-black" placeholder="Enter password" onKeyDown={(e) => { if (e.key === 'Enter') trySignIn(u) }} />
                <button onClick={() => trySignIn(u)} className="px-3 py-2 bg-sky-600 text-white rounded">Sign in</button>
                <button onClick={() => { setActiveId(null); setPw(''); setErr(null) }} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded">Cancel</button>
              </div>
            )}
            {activeId === u.id && err && <div className="text-xs text-red-600 mt-1">{err}</div>}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Create a new account (teacher)</h3>
        <form onSubmit={handleCreate} className="grid gap-2 md:grid-cols-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="border p-2 rounded col-span-2 bg-white text-black placeholder-gray-400" />
          <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 rounded bg-white text-black">
            <option value="admin">Teacher (admin)</option>
            <option value="student">Student</option>
          </select>
          <input value={createPassword} onChange={e => setCreatePassword(e.target.value)} placeholder="Password" type="password" className="border p-2 rounded bg-white text-black" />
          <div className="md:col-span-3 text-right">
            <button type="submit" className="px-3 py-2 bg-sky-600 text-white rounded">Create & sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}
