interface UseCookieReturn<T> {
  get: () => T | null
  set: (value: T, options?: { days?: number; path?: string }) => void
  remove: () => void
}

export function useCookie<T = string>(key: string): UseCookieReturn<T> {
  const get = (): T | null => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split('; ').reduce((acc, cur) => {
      const [k, v] = cur.split('=')
      acc[k!] = decodeURIComponent(v!)
      return acc
    }, {} as Record<string, string>)
    return (cookies[key] as unknown as T) || null
  }

  const set = (value: T, options: { days?: number; path?: string } = {}) => {
    if (typeof document === 'undefined') return
    const { days = 7, path = '/' } = options
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${key}=${encodeURIComponent(String(value))}; expires=${expires}; path=${path}`
  }

  const remove = () => {
    if (typeof document === 'undefined') return
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }

  return { get, set, remove }
}
