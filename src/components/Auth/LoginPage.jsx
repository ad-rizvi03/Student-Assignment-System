import React, { useState } from 'react'
import { FiUser, FiLock, FiMail, FiUsers, FiUserPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import UserListModal from './UserListModal'
import Toast from '../../components/Toast'
import { getDisplayName, getInitials } from '../../utils/user'

// sample users if none exist
const SAMPLE_USERS = [
  { id: 'u1', fullName: 'Prof. Ada Lovelace', username: 'adalovelace', email: 'ada@example.com', role: 'admin', password: '123456789' },
  { id: 'u2', fullName: 'Alice Johnson', username: 'alicej', email: 'alice@example.com', role: 'student', password: '123456789' }
]

function InputWithIcon({ icon: Icon, label, type = 'text', ...props }) {
  return (
    <label className="block text-sm">
      <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
        <div className="text-indigo-600 text-lg p-1">
          <Icon />
        </div>
        <input
          type={type}
          aria-label={label}
          placeholder={label}
          className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100"
          {...props}
        />
      </div>
      {props.hint && <div className="text-xs text-gray-400 mt-1">{props.hint}</div>}
    </label>
  )
}

export default function LoginPage({ users = [], courses = [], onLogin, onCreateUser, onDeleteUser, dark = false, onToggleDark }) {
  const [activeTab, setActiveTab] = useState('login') // 'login' | 'register'
  const [showList, setShowList] = useState(false)
  const [showToast, setShowToast] = useState(null)

  // new user form state
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [pendingNewUser, setPendingNewUser] = useState(null)
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [selectedCourseIds, setSelectedCourseIds] = useState([])
  const [teacherFilter, setTeacherFilter] = useState('')

  const onSelectUser = (u) => {
    onLogin && onLogin(u.id)
    setShowList(false)
    setShowToast(`Logged in as ${getDisplayName(u)}`)
    setTimeout(() => setShowToast(null), 2500)
  }

  function handleCreate(e) {
    e.preventDefault()
    const id = `u_${Date.now()}`
    const newUser = { id, fullName: fullName.trim() || username || 'User', username: username.trim() || `user${Date.now()}`, email, role, password }
    // If creating a student, open enrollment modal so they can pick teachers and courses
    if (role === 'student') {
      setPendingNewUser(newUser)
      setEnrollModalOpen(true)
      return
    }

    onCreateUser && onCreateUser(newUser)
    onLogin && onLogin(newUser.id)
    setShowToast(`Created and signed in as ${newUser.fullName}`)
    setTimeout(() => setShowToast(null), 2500)
    // clear form
    setFullName(''); setUsername(''); setEmail(''); setPassword(''); setRole('admin')
  }

  const list = (users && users.length) ? users : SAMPLE_USERS

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pine/10 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
  <div className="grid grid-cols-1 md:grid-cols-2 bg-white/80 dark:bg-black/60 backdrop-blur-lg rounded-2xl shadow-soft-lg overflow-hidden">
          {/* Left - Branding + Registered Users */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pine text-white flex items-center justify-center font-bold shadow-md">SAMS</div>
              <div>
                <h1 className="text-xl font-semibold text-taupe">Student Assignment System</h1>
                <p className="text-sm text-gray-600">Manage assignments effortlessly.</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3 py-1 rounded-full transition ${activeTab === 'login' ? 'bg-pine/10 text-pine' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Registered Users
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3 py-1 rounded-full transition ${activeTab === 'register' ? 'bg-pine/10 text-pine' : 'text-gray-600 hover:bg-gray-100'}`}>
                  New User
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-3">Quick sign in for returning users or create a new account in seconds. Role-based accents help identify Teacher (Admin) vs Student.</p>

              <div className="mt-6">
                <button onClick={() => setShowList(s => !s)} className="w-full border border-pine text-pine hover:bg-bronze/5 py-2 rounded-lg transition">
                  <div className="flex items-center justify-center gap-2">
                    <FiUsers /> Show Registered Users
                  </div>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="text-xs text-gray-500">Role</div>
                <div className="flex gap-2">
                  <button onClick={() => setRole('student')} className={`px-3 py-1 rounded-lg text-sm transition ${role === 'student' ? 'bg-pine/10 text-pine' : 'text-gray-600 hover:bg-gray-100'}`}>Student</button>
                  <button onClick={() => setRole('admin')} className={`px-3 py-1 rounded-lg text-sm transition ${role === 'admin' ? 'bg-pine/10 text-pine' : 'text-gray-600 hover:bg-gray-100'}`}>Teacher</button>
                </div>
                <div className="ml-auto">
                  <button onClick={() => onToggleDark && onToggleDark()} className="px-2 py-1 rounded bg-white/80 dark:bg-slate-700/60">
                    {dark ? '🌙' : '☀️'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Panel (switches between login/register) */}
          <div className="p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-taupe flex items-center gap-2">
                {activeTab === 'login' ? <><FiUsers /> Registered Users</> : <><FiUserPlus /> Create a New Account</>}
              </h2>
              <div className="text-sm text-gray-500">Demo • No backend</div>
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'login' ? (
                  <motion.div key="login" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.32 }}>
                    <div className="space-y-4">
                      {list.slice(0, 3).map(u => {
                        const displayName = getDisplayName(u)
                        const initials = getInitials(u)
                        return (
                          <button key={u.id} onClick={() => onSelectUser(u)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/60 hover:bg-indigo-50 transition shadow-sm">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${u.role === 'admin' ? 'bg-pine/10 text-pine' : 'bg-bronze/10 text-bronze'}`}>
                              {initials}
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium text-sm text-taupe">{displayName}</div>
                              <div className="text-xs text-gray-500">{u.email || u.username || ''} {u.email && '•'} {u.role === 'admin' ? 'Teacher' : 'Student'}</div>
                            </div>
                            <div className="text-sm text-pine">Sign in</div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.form key="register" onSubmit={handleCreate} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.32 }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithIcon icon={FiUser} label="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
                      <InputWithIcon icon={FiMail} label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithIcon icon={FiUser} label="Username" value={username} onChange={e => setUsername(e.target.value)} />
                      <InputWithIcon icon={FiLock} label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} hint="Min 8 characters" />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Role</label>
                      <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500">
                        <option value="admin">Teacher (Admin)</option>
                        <option value="student">Student</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform hover:scale-[1.02]">
                        Create Account & Sign In
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* small footer */}
              <div className="mt-6 text-center text-xs text-gray-500">By continuing, you agree to demo terms.</div>
            </div>
          </div>
        </div>
      </motion.div>

  <UserListModal open={showList} onClose={() => setShowList(false)} users={list} onSelect={onSelectUser} onDeleteUser={onDeleteUser} />

      {/* Enrollment modal for new students */}
      {enrollModalOpen && pendingNewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setEnrollModalOpen(false); setPendingNewUser(null); setSelectedTeachers([]); setSelectedCourseIds([]) }} />
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-4">
            <h3 className="text-lg font-semibold mb-3">Enroll in courses</h3>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 border-r pr-3">
                <div className="text-sm text-gray-600 mb-2">Select teacher(s)</div>
                <div className="mb-2">
                  <input value={teacherFilter} onChange={e => setTeacherFilter(e.target.value)} placeholder="Search teachers" className="w-full border p-2 rounded text-sm" />
                </div>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {(users || []).filter(u => u.role === 'admin' && getDisplayName(u).toLowerCase().includes(teacherFilter.trim().toLowerCase())).map(t => (
                    <div key={t.id} className={`p-2 rounded cursor-pointer flex items-center justify-between ${selectedTeachers.includes(t.id) ? 'bg-pine/10' : 'hover:bg-gray-100'}`}>
                      <div className="flex-1" onClick={() => setSelectedTeachers(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}>
                        <div className="font-medium">{getDisplayName(t)}</div>
                        <div className="text-xs text-gray-500">{t.email || t.username}</div>
                      </div>
                      <button className="text-xs px-2 py-1 rounded bg-bronze/10 text-bronze" onClick={() => {
                        // toggle select all courses for this teacher
                        const teacherCourses = (courses || []).filter(c => c.instructorId === t.id).map(c => c.id)
                        const allSelected = teacherCourses.every(cid => selectedCourseIds.includes(cid))
                        if (allSelected) {
                          setSelectedCourseIds(prev => prev.filter(x => !teacherCourses.includes(x)))
                        } else {
                          setSelectedCourseIds(prev => Array.from(new Set([...(prev || []), ...teacherCourses])))
                        }
                      }}>
                        Select all
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-600 mb-2">Courses (select subjects to enroll)</div>
                <div className="space-y-3 max-h-72 overflow-auto">
                  {selectedTeachers.length === 0 && <div className="text-sm text-gray-500">Pick a teacher to view their courses.</div>}
                  {selectedTeachers.map(tid => {
                    const teacher = (users || []).find(u => u.id === tid)
                    const teacherCourses = (courses || []).filter(c => c.instructorId === tid)
                    return (
                      <div key={tid} className="mb-2">
                        <div className="font-medium mb-1">{getDisplayName(teacher)}</div>
                        <div className="grid gap-2">
                          {teacherCourses.length === 0 && <div className="text-xs text-gray-500">No courses found for this teacher.</div>}
                          {teacherCourses.map(c => (
                            <label key={c.id} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={selectedCourseIds.includes(c.id)} onChange={e => {
                                if (e.target.checked) setSelectedCourseIds(prev => Array.from(new Set([...prev, c.id])))
                                else setSelectedCourseIds(prev => prev.filter(x => x !== c.id))
                              }} />
                              <div>{c.title} <span className="text-xs text-gray-400">({c.code})</span></div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 rounded bg-gray-200" onClick={() => { setEnrollModalOpen(false); setPendingNewUser(null); setSelectedTeachers([]); setSelectedCourseIds([]) }}>Cancel</button>
              <button className="px-4 py-2 rounded bg-emerald-600 text-white" onClick={() => {
                // call parent onCreateUser with selectedCourseIds
                onCreateUser && onCreateUser(pendingNewUser, selectedCourseIds)
                onLogin && onLogin(pendingNewUser.id)
                setShowToast(`Created and enrolled as ${pendingNewUser.fullName}`)
                setTimeout(() => setShowToast(null), 2500)
                // clear
                setPendingNewUser(null)
                setEnrollModalOpen(false)
                setSelectedTeachers([])
                setSelectedCourseIds([])
                setFullName(''); setUsername(''); setEmail(''); setPassword(''); setRole('admin')
              }}>Create account & Enroll</button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            <Toast message={showToast} onClose={() => setShowToast(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
