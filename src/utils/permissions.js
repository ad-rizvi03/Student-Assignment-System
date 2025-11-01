export function isAdmin(user) {
  if (!user) return false
  return user.role === 'admin'
}

export function canCreate(user) {
  return isAdmin(user)
}

export function canDelete(user) {
  return isAdmin(user)
}

export function canEditAssignment(user, assignment) {
  if (!user || !assignment) return false
  return user.role === 'admin' && assignment.createdBy === user.id
}

export function canModifySubmission(user, studentId) {
  // Students can modify their own submissions; admins cannot modify student submissions in this demo
  if (!user) return false
  if (user.role === 'student' && user.id === studentId) return true
  return false
}
