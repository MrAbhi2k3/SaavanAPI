import { userAgents, type Endpoints } from '#common/constants'
import type { ApiContextEnum } from '#common/enums'

type EndpointValue = (typeof Endpoints)[keyof typeof Endpoints]

interface FetchParams {
  endpoint: EndpointValue
  params: Record<string, string | number>
  context?: ApiContextEnum
}

interface FetchResponse<T> {
  data: T
  ok: Response['ok']
}

export const useFetch = async <T>({ endpoint, params, context }: FetchParams): Promise<FetchResponse<T>> => {
  const url = new URL('https://www.jiosaavn.com/api.php')

  url.searchParams.append('__call', endpoint.toString())
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context || 'web6dot0')

  Object.keys(params).forEach((key) => url.searchParams.append(key, String(params[key])))

  const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000) // 25 second timeout

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json', 'User-Agent': randomUserAgent },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`JioSaavn API error: ${response.status}`)
    }

    const data = await response.json()

    return { data: data as T, ok: response.ok }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: JioSaavn API is taking too long to respond')
      }
      throw error
    }
    throw new Error('Unknown error occurred while fetching data')
  }
}
