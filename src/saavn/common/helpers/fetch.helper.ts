import { userAgents, type Endpoints } from '#common/constants'
import type { ApiContextEnum } from '#common/enums'
import { getCached, setCached, getCacheKey } from './cache.helper'

type EndpointValue = (typeof Endpoints)[keyof typeof Endpoints]

interface FetchParams {
  endpoint: EndpointValue
  params: Record<string, string | number>
  context?: ApiContextEnum
  cache?: boolean
  cacheTTL?: number
}

interface FetchResponse<T> {
  data: T
  ok: Response['ok']
}

export const useFetch = async <T>({ endpoint, params, context, cache: useCache = true, cacheTTL = 3600 }: FetchParams): Promise<FetchResponse<T>> => {
  // Check cache first
  if (useCache) {
    const cacheKey = getCacheKey(endpoint.toString(), params)
    const cached = getCached<T>(cacheKey)
    if (cached) {
      return { data: cached, ok: true }
    }
  }

  const url = new URL('https://www.jiosaavn.com/api.php')

  url.searchParams.append('__call', endpoint.toString())
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context || 'web6dot0')

  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])))

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  // Retry logic with exponential backoff
  const maxRetries = 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 55000) // 55 second timeout

    try {
      const response = await fetch(url.toString(), {
        headers: { 
          'Content-Type': 'application/json', 
          'User-Agent': randomUserAgent,
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: controller.signal,
        cache: 'no-store'
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`JioSaavn API returned status ${response.status}`)
      }

      const data = await response.json()

      // Cache successful response
      if (useCache) {
        const cacheKey = getCacheKey(endpoint.toString(), params)
        setCached(cacheKey, data, cacheTTL)
      }

      return { data: data as T, ok: response.ok }
    } catch (error) {
      clearTimeout(timeoutId)
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Don't retry on timeout for the last attempt
      if (attempt === maxRetries) {
        break
      }

      // Wait before retry (exponential backoff: 1s, 2s)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }

  // All retries failed
  if (lastError?.name === 'AbortError') {
    throw new Error('JioSaavn API timeout - service may be slow or unavailable')
  }
  throw lastError || new Error('Failed to fetch data from JioSaavn')
}

