// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expiry: number }>()

export const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key)
  
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }
  
  return entry.data as T
}

export const setCached = <T>(key: string, data: T, ttlSeconds = 3600): void => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  })
}

export const clearCache = (): void => {
  cache.clear()
}

export const getCacheKey = (endpoint: string, params: Record<string, any>): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')
  
  return `${endpoint}:${sortedParams}`
}
