import { ref } from 'vue'

export const isAuthenticated = ref(false)

export function login(username, password) {
  // Hardcoded authentication check
  if (username === 'admin' && password === 'Password123%') {
    isAuthenticated.value = true
    return true
  }
  return false
}

export function logout() {
  isAuthenticated.value = false
}
