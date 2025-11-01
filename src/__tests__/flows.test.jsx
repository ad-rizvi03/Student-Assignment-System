import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import StudentView from '../views/StudentView'
import AdminView from '../views/AdminView'

function renderWithState(ui, { props }) {
  return render(React.createElement(ui, props))
}

test('student can mark and unmark an assignment', async () => {
  const currentUser = { id: 'u_student_1', name: 'Alice', role: 'student' }
  const assignments = [
    {
      id: 'a1',
      title: 'Test Assign',
      description: 'desc',
      dueDate: '2025-11-01',
      driveLink: '',
      createdBy: 'u_admin_1',
      assignedTo: ['u_student_1'],
      submissions: { u_student_1: { submitted: false, timestamp: null } }
    }
  ]

  let state = [...assignments]
  function onUpdate(next) { state = next }

  const { rerender } = render(
    <StudentView currentUser={currentUser} assignments={state} onUpdate={(a) => { onUpdate(a); rerender(<StudentView currentUser={currentUser} assignments={state} onUpdate={onUpdate} />) }} />
  )

  // mark as submitted
  const markBtn = screen.getByText(/Mark as submitted/i)
  fireEvent.click(markBtn)

  // first confirm
  const confirm1 = await screen.findByText('Confirm')
  fireEvent.click(confirm1)

  // second modal final confirm
  const final = await screen.findAllByText('Confirm')
  // click the last Confirm (final)
  fireEvent.click(final[final.length - 1])

  await waitFor(() => {
    // find the specific assignment card and assert the status text inside it
    const card = screen.getByText('Test Assign').closest('div')
    const w = within(card)
    expect(w.getByText(/^Submitted$/i)).toBeTruthy()
  })

  // now unmark
  const unmarkBtn = screen.getByText(/Mark as not submitted/i)
  fireEvent.click(unmarkBtn)

  const undoConfirm = await screen.findByText(/This will mark the assignment as not submitted again/i)
  const confirmUndo = await screen.findByText('Confirm')
  fireEvent.click(confirmUndo)

  await waitFor(() => {
    const card = screen.getByText('Test Assign').closest('div')
    const w = within(card)
    expect(w.getByText(/^Not submitted$/i)).toBeTruthy()
  })
})

test('admin can delete and undo', async () => {
  const users = [
    { id: 'u_admin_1', name: 'Prof', role: 'admin' },
    { id: 'u_student_1', name: 'Alice', role: 'student' }
  ]

  const assignments = [
    {
      id: 'a1',
      title: 'DeleteMe',
      description: 'desc',
      dueDate: '2025-11-01',
      driveLink: '',
      createdBy: 'u_admin_1',
      assignedTo: ['u_student_1'],
      submissions: { u_student_1: { submitted: false, timestamp: null } }
    }
  ]

  let state = [...assignments]
  function onUpdate(next) { state = next }

  const { rerender } = render(
    <AdminView currentUser={users[0]} users={users} assignments={state} onUpdate={(a) => { onUpdate(a); rerender(<AdminView currentUser={users[0]} users={users} assignments={state} onUpdate={onUpdate} />) }} />
  )

  // click delete
  const delBtn = screen.getByText('Delete')
  fireEvent.click(delBtn)

  // confirm modal
  const confirm = await screen.findByText('Confirm')
  fireEvent.click(confirm)

  // toast appears
  await waitFor(() => expect(screen.getByText(/Deleted: DeleteMe/i)).toBeTruthy())

  // undo
  const undo = screen.getByText('Undo')
  fireEvent.click(undo)

  await waitFor(() => expect(screen.getByText(/DeleteMe/i)).toBeInTheDocument())
})
