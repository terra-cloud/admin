import { reactive } from 'vue'

const state = reactive({
  admin: null,
  loading: false
})

export function getAccessToken() {
  return sessionStorage.getItem('access_token') || localStorage.getItem('access_token')
}

export function setAccessToken(token, rememberMe = false) {
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('access_token');

  if (!token) return;

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('access_token', token);
}

export function setAdmin(admin) {
  state.admin = admin
}

export function clearAuth() {
  state.admin = null
  localStorage.removeItem('access_token')
  sessionStorage.removeItem('access_token')
}

export { state }
