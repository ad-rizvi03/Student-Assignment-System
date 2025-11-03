import React, { useMemo, useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { getDisplayName } from '../utils/user'
import Toast from '../components/Toast'

export default function AssignmentPage({ course, assignments, users, groups, onUpdateAssignment, onAddGroup, currentUser }) {
  const courseAssignments = assignments.filter(a => a.courseId === course.id)
  const [selected, setSelected] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', driveLink: '', submissionType: 'individual', assignedGroupIds: [] })
  const [toast, setToast] = useState(null)
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupLeader, setNewGroupLeader] = useState(course?.studentIds?.[0] || '')

  function pctSubmitted(a) {
    if (a.submissionType === 'individual') {
      const total = a.assignedTo.length
      const done = a.assignedTo.filter(sid => {
        const s = a.submissions?.[sid]
        return s && (s.acknowledged || s.submitted)
      }).length
      return total === 0 ? 0 : Math.round((done / total) * 100)
    }
    // group
    const total = a.assignedTo.length
    const done = a.assignedTo.filter(gid => {
      const s = a.submissions?.[gid]
      return s && (s.acknowledged || s.submitted)
    }).length
    return total === 0 ? 0 : Math.round((done / total) * 100)
  }

  function userGroupForCourse(userId) {
    return groups.find(g => g.courseId === course.id && g.memberIds.includes(userId))
  }

  function canAcknowledge(a) {
    if (a.submissionType === 'individual') return a.assignedTo.includes(currentUser.id)
    const g = userGroupForCourse(currentUser.id)
    if (!g) return false
    return g.leaderId === currentUser.id
  }

  function createAssignment(e) {
    e.preventDefault()
    // validation
    if (!form.title || !form.title.trim()) { setToast({ message: 'Title is required' }); return }
    if (!form.dueDate || !form.dueDate.trim()) { setToast({ message: 'Due date is required' }); return }
    if (form.submissionType === 'group' && (!form.assignedGroupIds || !form.assignedGroupIds.length)) { setToast({ message: 'Select at least one group' }); return }

    const id = `${course.id}_a_${Date.now()}`
    const assignedTo = form.submissionType === 'individual' ? (course.studentIds || []) : (form.assignedGroupIds || [])
  const submissions = Object.fromEntries((assignedTo || []).map(sid => [sid, { submitted: false, timestamp: null, submittedBy: null }]))
    const dueIso = (() => { try { return new Date(form.dueDate).toISOString() } catch (e) { return new Date().toISOString() } })()
    const newA = {
      id,
      courseId: course.id,
      title: form.title || 'Untitled',
      description: form.description || '',
      dueDate: dueIso,
      driveLink: form.driveLink || '',
      createdBy: currentUser.id,
      submissionType: form.submissionType,
      assignedTo: assignedTo,
      submissions,
    }
    // append to existing assignments and notify parent
    onUpdateAssignment([...(assignments || []), newA])
    setForm({ title: '', description: '', dueDate: '', driveLink: '', submissionType: 'individual' })
    setOpenForm(false)
    setToast({ message: 'Project created' })
  }

  function handleSubmit(a) {
    const now = new Date().toISOString()
    const next = assignments.map(x => {
      if (x.id !== a.id) return x
      const key = a.submissionType === 'individual' ? currentUser.id : (userGroupForCourse(currentUser.id)?.id)
      return {
        ...x,
        submissions: {
          ...(x.submissions || {}),
          [key]: { submitted: true, timestamp: now, submittedBy: currentUser.id }
        }
      }
    })
    onUpdateAssignment(next)
  }

  function handleUnsubmit(a) {
    const next = assignments.map(x => {
      if (x.id !== a.id) return x
      const key = a.submissionType === 'individual' ? currentUser.id : (userGroupForCourse(currentUser.id)?.id)
      return {
        ...x,
        submissions: {
          ...(x.submissions || {}),
          [key]: { submitted: false, timestamp: null, submittedBy: null }
        }
      }
    })
    onUpdateAssignment(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{course.title}</h2>
          <div className="text-sm text-gray-500">{course.code} • {course.term}</div>
        </div>
        <div>
          {/* show New Project button to course instructor (teacher) */}
          {(currentUser && (currentUser.id === course.instructorId || currentUser.role === 'admin')) && (
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenForm(o => !o)} className="px-3 py-2 bg-sky-600 text-white rounded">{openForm ? 'Close' : 'New Project'}</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {openForm && (
          <form onSubmit={createAssignment} className="card-surface p-4 rounded mb-4">
            <div className="grid gap-2 md:grid-cols-2">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="border p-2 rounded" />
              <input value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} type="datetime-local" placeholder="Due date" className="border p-2 rounded" />
              <input value={form.driveLink} onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} placeholder="Drive link" className="border p-2 rounded col-span-2" />
              <select value={form.submissionType} onChange={e => setForm(f => ({ ...f, submissionType: e.target.value }))} className="border p-2 rounded">
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
              {form.submissionType === 'group' && (
                <div className="col-span-2">
                  <label className="text-sm">Assign to groups</label>
                  <select multiple value={form.assignedGroupIds} onChange={e => {
                    const opts = Array.from(e.target.selectedOptions).map(o => o.value)
                    setForm(f => ({ ...f, assignedGroupIds: opts }))
                  }} className="border p-2 rounded w-full mt-1">
                    {(groups || []).filter(g => g.courseId === course.id).map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>

                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => setCreatingGroup(s => !s)} className="text-sm px-2 py-1 rounded bg-bronze text-white">{creatingGroup ? 'Cancel' : 'Create group'}</button>
                    <div className="text-xs text-gray-500">Or pick existing groups</div>
                  </div>

                  {creatingGroup && (
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group name" className="border p-2 rounded" />
                      <select value={newGroupLeader} onChange={e => setNewGroupLeader(e.target.value)} className="border p-2 rounded">
                        {(course.studentIds || []).map(sid => {
                          const s = users.find(u => u.id === sid)
                          return <option key={sid} value={sid}>{getDisplayName(s)}</option>
                        })}
                      </select>
                      <div className="col-span-2 flex justify-end gap-2">
                        <button type="button" onClick={() => { setCreatingGroup(false); setNewGroupName(''); setNewGroupLeader(course.studentIds?.[0] || '') }} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="button" onClick={() => {
                          // validate
                          if (!newGroupName || !newGroupName.trim()) { setToast({ message: 'Group name required' }); return }
                          if (!newGroupLeader) { setToast({ message: 'Choose a leader' }); return }
                          const gid = `${course.id}_g_${Date.now()}`
                          const newG = { id: gid, courseId: course.id, name: newGroupName, leaderId: newGroupLeader, memberIds: [newGroupLeader] }
                          if (onAddGroup) onAddGroup(newG)
                          // add to selected groups
                          setForm(f => ({ ...f, assignedGroupIds: [...(f.assignedGroupIds || []), gid] }))
                          setNewGroupName('')
                          setNewGroupLeader(course.studentIds?.[0] || '')
                          setCreatingGroup(false)
                          setToast({ message: 'Group created' })
                        }} className="px-3 py-2 bg-emerald-600 text-white rounded">Create group</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="border p-2 rounded col-span-2" />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => { setOpenForm(false); setForm({ title: '', description: '', dueDate: '', driveLink: '', submissionType: 'individual' }) }} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Create Project</button>
            </div>
          </form>
        )}
        {courseAssignments.map(a => (
          <div key={a.id} className="rounded-2xl card-surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-taupe">{a.title}</h3>
                <div className="text-sm text-gray-600 mt-1">{a.description}</div>
                <div className="text-xs text-gray-500 mt-2">Due: {new Date(a.dueDate).toLocaleString()}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-40">
                    <ProgressBar percent={pctSubmitted(a)} />
                  </div>
                  <div className="text-sm text-gray-600">{pctSubmitted(a)}% acknowledged</div>
                </div>
              </div>

              <div className="w-56 text-right">
                <div className="text-sm">Submission</div>
                <div className="text-sm font-medium mt-1">
                  {a.submissionType === 'individual' ? 'Individual' : 'Group'}
                </div>
                <div className="mt-3">
                  {currentUser && currentUser.role === 'student' ? (
                    (() => {
                      const key = a.submissionType === 'individual' ? currentUser.id : (userGroupForCourse(currentUser.id)?.id)
                      const curr = a.submissions?.[key] || { submitted: false }
                      if (!canAcknowledge(a)) {
                        return <div className="text-xs text-gray-500">{a.submissionType === 'group' ? 'Only group leader can submit' : 'You are not assigned'}</div>
                      }
                      return curr.submitted ? (
                        <div className="flex justify-end">
                          <button onClick={() => handleUnsubmit(a)} className="px-3 py-2 bg-rose-600 text-white rounded">Unsubmit</button>
                        </div>
                      ) : (
                        <button onClick={() => handleSubmit(a)} className="px-3 py-2 bg-pine text-white rounded">Submit</button>
                      )
                    })()
                  ) : (
                    <div className="text-xs text-gray-500">Instructor view</div>
                  )}
                </div>
              </div>
            </div>

            {/* list details */}
            <div className="mt-4 grid gap-2">
              {a.submissionType === 'individual' ? (
                (() => {
                  // Students should only see their own entry; instructors/admins see everyone
                  const list = (currentUser && currentUser.role === 'student')
                    ? (a.assignedTo || []).filter(sid => sid === currentUser.id)
                    : (a.assignedTo || [])

                  if (!list || list.length === 0) {
                    return (
                      <div className="text-sm text-gray-500">{currentUser && currentUser.role === 'student' ? 'You are not assigned to this project' : 'No students assigned'}</div>
                    )
                  }

                  return list.map(sid => {
                    const s = users.find(u => u.id === sid)
                    const sub = a.submissions?.[sid] || { submitted: false }
                    return (
                      <div key={sid} className="flex items-center gap-4">
                        <div className="w-48 text-sm">{getDisplayName(s)}</div>
                        <div className="flex-1"><ProgressBar percent={sub.submitted ? 100 : 0} /></div>
                        <div className="w-40 text-sm text-right">{sub.submitted ? `Submitted • ${new Date(sub.timestamp).toLocaleString()}` : 'Not submitted'}</div>
                      </div>
                    )
                  })
                })()
              ) : (
                (() => {
                  // Group assignments: students see only their group entry; teachers/admins see all groups
                  if (currentUser && currentUser.role === 'student') {
                    const g = userGroupForCourse(currentUser.id)
                    if (!g) {
                      return <div className="text-sm text-gray-500">You are not in a group for this course</div>
                    }
                    const gid = g.id
                    const sub = a.submissions?.[gid] || { acknowledged: false }
                    return (
                      <div key={gid} className="flex items-center gap-4">
                        <div className="w-48 text-sm">{g.name} (Leader: {getDisplayName(users.find(u => u.id === g.leaderId))})</div>
                        <div className="flex-1"><ProgressBar percent={sub.acknowledged ? 100 : 0} /></div>
                        <div className="w-40 text-sm text-right">{sub.acknowledged ? `Acknowledged • ${new Date(sub.timestamp).toLocaleString()}` : 'Not acknowledged'}</div>
                      </div>
                    )
                  }

                  // instructor/admin view: show all groups
                  return a.assignedTo.map(gid => {
                    const g = groups.find(x => x.id === gid)
                    const sub = a.submissions?.[gid] || { submitted: false }
                    return (
                      <div key={gid} className="flex items-center gap-4">
                        <div className="w-48 text-sm">{g.name} (Leader: {getDisplayName(users.find(u => u.id === g.leaderId))})</div>
                        <div className="flex-1"><ProgressBar percent={sub.submitted ? 100 : 0} /></div>
                        <div className="w-40 text-sm text-right">{sub.submitted ? `Submitted • ${new Date(sub.timestamp).toLocaleString()}` : 'Not submitted'}</div>
                      </div>
                    )
                  })
                })()
              )}
            </div>

          </div>
        ))}
      </div>
      {toast && (
        <Toast message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
