export function url(uri: string) {
  return new URL(uri, import.meta.env.VITE_API_BASE_URL).href
}
