import React, { useEffect, useState } from 'react'
import { users as mockUsers, assignments as mockAssignments } from './data/mockData'
import { loadState, saveState, getDefaultPrefs } from './utils/storage'
import LoginView from './views/LoginView'
import LoginPage from './components/Auth/LoginPage'
import StudentView from './views/StudentView'
import AdminView from './views/AdminView'
import Header from './components/Header'

export default function App() {
  // load persisted or defaults
  const persisted = loadState()
  // make users mutable so new accounts can be created via the login screen
  const [users, setUsers] = useState(persisted?.users || mockUsers)
  const [assignments, setAssignments] = useState(persisted?.assignments || mockAssignments)
  // start with persisted user if present, otherwise force explicit login
  const [currentUserId, setCurrentUserId] = useState(persisted?.currentUserId ?? null)

  // per-user preferences map: { [userId]: { dark, layout, sortBy } }
  const [prefsByUser, setPrefsByUser] = useState(persisted?.prefsByUser || {})

  const currentUser = users.find(u => u.id === currentUserId) || users[0]

  const currentPrefs = prefsByUser[currentUserId] || getDefaultPrefs()
  const [dark, setDark] = useState(currentPrefs.dark)
  const currentLayout = currentPrefs.layout || 'grid'

  // when switching user or when prefsByUser changes, sync dark state to that user's preference
  useEffect(() => {
    const p = prefsByUser[currentUserId] || getDefaultPrefs()
    setDark(p.dark)
  }, [currentUserId, prefsByUser])

  // persist the entire app state including prefsByUser
  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch (e) {}
    saveState({ users, assignments, currentUserId, prefsByUser })
  }, [assignments, currentUserId, users, prefsByUser, dark])

  

  function handleUpdate(newAssignments) {
    setAssignments(newAssignments)
  }

  function updateCurrentUserPrefs(updates) {
    setPrefsByUser(prev => {
      const next = { ...prev }
      next[currentUserId] = { ...(next[currentUserId] || {}), ...updates }
      return next
    })
  }

  function toggleDarkForCurrentUser() {
    const next = !dark
    setDark(next)
    updateCurrentUserPrefs({ dark: next })
  }

  // preview toggle used on the login screen (does not persist until user logs in)
  function toggleDarkPreview() {
    const next = !dark
    setDark(next)
  }

  function toggleLayoutForCurrentUser() {
    const next = currentLayout === 'grid' ? 'list' : 'grid'
    updateCurrentUserPrefs({ layout: next })
  }

  function handleLogin(userId) {
    // set current user
    setCurrentUserId(userId)
    // persist the current preview dark setting into the user's prefs so their choice carries over
    setPrefsByUser(prev => {
      const next = { ...(prev || {}) }
      next[userId] = { ...(next[userId] || {}), dark }
      return next
    })
  }

  function handleCreateUser(newUser) {
    setUsers(prev => {
      const next = [...prev, newUser]
      return next
    })
    setCurrentUserId(newUser.id)
  }

  // if not logged in show login UI
  if (!currentUserId) {
    return (
      <div>
        <LoginPage users={users} onLogin={handleLogin} onCreateUser={handleCreateUser} dark={dark} onToggleDark={toggleDarkPreview} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-slate-900 dark:text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header users={users} currentUserId={currentUserId} onSwitchUser={setCurrentUserId} dark={dark} onToggleDark={toggleDarkForCurrentUser} layout={currentLayout} onToggleLayout={toggleLayoutForCurrentUser} />

        <main>
          {currentUser.role === 'student' ? (
            <StudentView currentUser={currentUser} assignments={assignments} onUpdate={handleUpdate} layout={currentLayout} />
          ) : (
            <AdminView currentUser={currentUser} users={users} assignments={assignments} onUpdate={handleUpdate} layout={currentLayout} />
          )}
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">© 2025 Student Assignment System | Built with ❤️ using React + Tailwind</footer>
      </div>
    </div>
  )
}
