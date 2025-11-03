// small helper utilities to normalize and present user display names / initials
export function getDisplayName(u) {
  if (!u) return 'User'
  return u.displayName || u.name || u.fullName || u.username || u.email || u.id || 'User'
}

export function getInitials(u) {
  const name = typeof u === 'string' ? u : getDisplayName(u)
  return String(name)
    .split(' ')
    .map(n => (n && n[0]) || '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function normalizeUser(u) {
  if (!u) return u
  const displayName = getDisplayName(u)
  const initials = getInitials(displayName)
  return { ...u, displayName, initials }
}

export function normalizeUsers(arr) {
  return (arr || []).map(normalizeUser)
}
