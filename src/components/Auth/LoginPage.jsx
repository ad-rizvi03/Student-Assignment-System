import React, { useState } from 'react'
import UserListModal from './UserListModal'
import Toast from '../../components/Toast'

// sample users if none exist
const SAMPLE_USERS = [
  { id: 'u1', fullName: 'Prof. Ada Lovelace', username: 'adalovelace', email: 'ada@example.com', role: 'admin', password: '123456789' },
  { id: 'u2', fullName: 'Alice Johnson', username: 'alicej', email: 'alice@example.com', role: 'student', password: '123456789' }
]

export default function LoginPage({ users = [], onLogin, onCreateUser, dark = false, onToggleDark }) {
  const [showList, setShowList] = useState(false)
  const [showToast, setShowToast] = useState(null)

  // new user form state
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')

  const onSelectUser = (u) => {
    onLogin && onLogin(u.id)
    setShowList(false)
    setShowToast(`Logged in as ${u.fullName}`)
    setTimeout(() => setShowToast(null), 2500)
  }

  function handleCreate(e) {
    e.preventDefault()
    const id = `u_${Date.now()}`
    const newUser = { id, fullName: fullName.trim() || username || 'User', username: username.trim() || `user${Date.now()}`, email, role, password }
    onCreateUser && onCreateUser(newUser)
    onLogin && onLogin(newUser.id)
    setShowToast(`Created and signed in as ${newUser.fullName}`)
    setTimeout(() => setShowToast(null), 2500)
    // clear form
    setFullName(''); setUsername(''); setEmail(''); setPassword(''); setRole('admin')
  }

  const list = (users && users.length) ? users : SAMPLE_USERS

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered users */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">👥 Registered Users</h3>
              <button onClick={() => setShowList(s => !s)} className="px-3 py-1 rounded bg-sky-600 text-white">Show Registered Users</button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Select an account to sign in quickly. Click the button above to view all registered users.</p>
          </div>

          {/* New user */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">🆕 New User</h3>
              <div>
                <button onClick={() => onToggleDark && onToggleDark()} className="px-2 py-1 rounded bg-white/80 dark:bg-slate-700/60">
                  {dark ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
            <form onSubmit={handleCreate} className="grid gap-2">
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="border p-2 rounded bg-white text-black" />
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="border p-2 rounded bg-white text-black" />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded bg-white text-black" />
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="border p-2 rounded bg-white text-black" />
              <select value={role} onChange={e => setRole(e.target.value)} className="border p-2 rounded bg-white text-black">
                <option value="admin">Teacher (Admin)</option>
                <option value="student">Student</option>
              </select>
              <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Create Account & Sign In</button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer small hint */}
        <div className="mt-6 text-sm text-slate-500">By continuing you agree to this demo's simple terms. No backend involved — data is stored locally.</div>
      </div>

      <UserListModal open={showList} onClose={() => setShowList(false)} users={list} onSelect={onSelectUser} />

      {showToast && (
        <Toast message={showToast} onClose={() => setShowToast(null)} />
      )}
    </div>
  )
}
