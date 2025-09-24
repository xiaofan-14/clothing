import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from '@/composables/useCookie'
import type { User } from '@clothing/servers/type'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string>('token')

  const token = ref<string | null>(tokenCookie.get())
  const user = ref<User | null>(null)

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    tokenCookie.set(newToken, { days: 7 })
  }

  function clearAuth() {
    token.value = null
    user.value = null
    tokenCookie.remove()
  }

  return {
    token,
    user,
    setAuth,
    clearAuth,
  }
})
