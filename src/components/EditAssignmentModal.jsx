import React, { useEffect, useState } from 'react'

export default function EditAssignmentModal({ open, assignment, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', driveLink: '' })

  useEffect(() => {
    if (assignment) {
      setForm({
        title: assignment.title || '',
        description: assignment.description || '',
        dueDate: assignment.dueDate || '',
        driveLink: assignment.driveLink || ''
      })
    }
  }, [assignment])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!assignment) return
    const updated = { ...assignment, title: form.title, description: form.description, dueDate: form.dueDate, driveLink: form.driveLink }
    onSave && onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <form onSubmit={handleSubmit} className="card-surface rounded-lg p-6 w-11/12 max-w-lg">
        <h3 className="text-lg font-semibold mb-3">Edit assignment</h3>
        <div className="grid gap-2">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="border p-2 rounded bg-white dark:bg-slate-800/80 dark:text-white" />
          <input value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="Due date (YYYY-MM-DD)" className="border p-2 rounded bg-white dark:bg-slate-800/80 dark:text-white" />
          <input value={form.driveLink} onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))} placeholder="Drive link" className="border p-2 rounded bg-white dark:bg-slate-800/80 dark:text-white" />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="border p-2 rounded bg-white dark:bg-slate-800/80 dark:text-white" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white">Save</button>
        </div>
      </form>
    </div>
  )
}
