const STORAGE_KEY = 'sas_demo_v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load state', e)
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state', e)
  }
}

// Per-user UI preferences stored within the main state object under `prefsByUser`.
export function getUserPrefs(state, userId) {
  if (!state) return getDefaultPrefs()
  const prefs = state.prefsByUser && state.prefsByUser[userId]
  return prefs ? prefs : getDefaultPrefs()
}

export function setUserPrefs(state, userId, prefs) {
  const next = { ...(state || {}) }
  next.prefsByUser = { ...(next.prefsByUser || {}) }
  next.prefsByUser[userId] = { ...(next.prefsByUser[userId] || {}), ...prefs }
  saveState(next)
  return next
}

export function getDefaultPrefs() {
  return {
    dark: false,
    layout: 'grid', // or 'list'
    sortBy: 'dueDate'
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear state', e)
  }
}
