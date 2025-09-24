type fetchOptions = Omit<RequestInit, 'body' | 'method'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  query?: Record<string, any>
}

export async function useFetch<T>(path: string, options: fetchOptions = {}): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  let url = `${baseUrl}${path}`

  const { method = 'GET', body, query, headers = {}, ...rest } = options

  // 拼接 query 参数
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams()
    for (const key in query) {
      const val = query[key]
      if (val !== undefined && val !== null) {
        params.append(key, String(val))
      }
    }
    url += `?${params.toString()}`
  }

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API Error: ${res.status} ${text}`)
  }

  const raw = await res.json() as { result: { data: T } };

  return Promise.resolve(raw.result.data)
}
