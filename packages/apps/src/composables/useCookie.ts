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
      if (k && v) acc[k] = decodeURIComponent(v)
      return acc
    }, {} as Record<string, string>)

    const value = cookies[key]
    if (!value) return null

    try {
      // 尝试解析 JSON，如果失败就返回原字符串
      return JSON.parse(value) as T
    } catch {
      return value as unknown as T
    }
  }

  const set = (value: T, options: { days?: number; path?: string } = {}) => {
    if (typeof document === 'undefined') return
    const { days = 7, path = '/' } = options
    const expires = new Date(Date.now() + days * 864e5).toUTCString()

    // 如果是对象或数组就序列化
    const str = typeof value === 'string' ? value : JSON.stringify(value)
    document.cookie = `${key}=${encodeURIComponent(str)}; expires=${expires}; path=${path}`
  }

  const remove = () => {
    if (typeof document === 'undefined') return
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }

  return { get, set, remove }
}
