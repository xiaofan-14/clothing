import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from '@/composables/useCookie'
import type { User } from '@clothing/servers/type'

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string>('token')
  const userCookie = useCookie<User>('user')

  const token = ref<string | null>(tokenCookie.get())
  const user = ref<User | null>(userCookie.get())

  function setAuth(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    tokenCookie.set(newToken, { days: 7 })
    userCookie.set(newUser, { days: 7 })
  }

  function clearAuth() {
    token.value = null
    user.value = null
    tokenCookie.remove()
    userCookie.remove()
  }

  return {
    token,
    user,
    setAuth,
    clearAuth,
  }
})
