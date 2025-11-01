import React, { useState, useMemo } from 'react'
import AssignmentCard from '../components/AssignmentCard'
import ConfirmModal from '../components/ConfirmModal'
import AssignmentDrawer from '../components/AssignmentDrawer'

export default function StudentView({ currentUser, assignments, onUpdate, layout = 'grid' }) {
  const [selected, setSelected] = useState(null)
  const [action, setAction] = useState(null) // 'mark' | 'unmark' | null
  const [stage, setStage] = useState(0)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('due')
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleMark(assignment) {
    setSelected(assignment)
    setAction('mark')
    setStage(1)
  }

  function handleUnmark(assignment) {
    setSelected(assignment)
    setAction('unmark')
    setStage(1)
  }

  function close() {
    setSelected(null)
    setAction(null)
    setStage(0)
  }

  function confirmFinalMark() {
    if (!selected) return
    const copy = assignments.map(a => {
      if (a.id !== selected.id) return a
      return {
        ...a,
        submissions: {
          ...a.submissions,
          [currentUser.id]: { submitted: true, timestamp: new Date().toISOString() },
        },
      }
    })
    onUpdate(copy)
    close()
  }

  function confirmUnmark() {
    if (!selected) return
    const copy = assignments.map(a => {
      if (a.id !== selected.id) return a
      return {
        ...a,
        submissions: {
          ...a.submissions,
          [currentUser.id]: { submitted: false, timestamp: null },
        },
      }
    })
    onUpdate(copy)
    close()
  }

  const myAssignments = useMemo(() => assignments.filter(a => a.assignedTo.includes(currentUser.id)), [assignments, currentUser.id])

  const filtered = useMemo(() => {
    let list = myAssignments.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
    if (sortBy === 'due') list = list.sort((x, y) => new Date(x.dueDate) - new Date(y.dueDate))
    if (sortBy === 'title') list = list.sort((x, y) => x.title.localeCompare(y.title))
    return list
  }, [myAssignments, query, sortBy])

  const completed = myAssignments.filter(a => a.submissions?.[currentUser.id]?.submitted).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Assignments</h2>
        <div className="text-sm text-gray-600">{completed} of {myAssignments.length} submitted ✅ ({myAssignments.length ? Math.round((completed/myAssignments.length)*100) : 0}%)</div>
      </div>

      <div className="flex gap-2 items-center">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assignments..." className="border p-2 rounded w-full md:w-1/3" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded bg-white dark:bg-white text-black">
          <option value="due">Sort by due date</option>
          <option value="title">Sort by title</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-bg-vars p-6 rounded card-shadow border card-border text-center">
          <div className="text-2xl text-slate-900 dark:text-white">No assignments yet! Enjoy your free time 😄</div>
        </div>
      ) : (
        layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filtered.map(a => (
              <AssignmentCard key={a.id} assignment={a} studentId={currentUser.id} onMark={handleMark} onUnmark={handleUnmark} onOpen={(ass) => { setSelected(ass); setDrawerOpen(true) }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(a => (
              <div key={a.id} className="transition-transform duration-150 hover:scale-105">
                <AssignmentCard assignment={a} studentId={currentUser.id} onMark={handleMark} onUnmark={handleUnmark} onOpen={(ass) => { setSelected(ass); setDrawerOpen(true) }} />
              </div>
            ))}
          </div>
        )
      )}

      <AssignmentDrawer open={drawerOpen} assignment={selected} onClose={() => setDrawerOpen(false)} />

      {/* Modals */}
      <ConfirmModal
        open={!!selected && action === 'mark' && stage === 1}
        title="Have you submitted your work?"
        onClose={close}
        onConfirm={() => setStage(2)}
      >
        Click "Confirm" to acknowledge that you have submitted to the external submission link. You will be asked to confirm one more time.
      </ConfirmModal>

      <ConfirmModal
        open={!!selected && action === 'mark' && stage === 2}
        title="Final confirmation"
        onClose={close}
        onConfirm={confirmFinalMark}
      >
        This will mark the assignment as submitted for you. This action is persistent in your browser.
      </ConfirmModal>

      <ConfirmModal
        open={!!selected && action === 'unmark' && stage === 1}
        title="Revert submission?"
        onClose={close}
        onConfirm={confirmUnmark}
      >
        This will mark the assignment as not submitted again. Use this if you marked it by mistake.
      </ConfirmModal>
    </div>
  )
}
