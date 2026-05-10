import { reactive } from 'vue'

const state = reactive({
  admin: null,
  loading: false
})

export function getAccessToken() {
  return localStorage.getItem('access_token')
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem('access_token', token)
  } else {
    localStorage.removeItem('access_token')
  }
}

export function setAdmin(admin) {
  state.admin = admin
}

export function clearAuth() {
  state.admin = null
  localStorage.removeItem('access_token')
}

export { state }
