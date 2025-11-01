import { loadState, saveState } from '../utils/storage'

// Thin wrapper for accessing users/currentUser via the app storage key
export function getStoredUsers() {
  const state = loadState()
  return (state && state.users) || null
}

export function setStoredUsers(users) {
  const state = loadState() || {}
  const next = { ...state, users }
  saveState(next)
}

export function getStoredCurrentUserId() {
  const state = loadState()
  return state?.currentUserId ?? null
}

export function setStoredCurrentUserId(id) {
  const state = loadState() || {}
  const next = { ...state, currentUserId: id }
  saveState(next)
}
