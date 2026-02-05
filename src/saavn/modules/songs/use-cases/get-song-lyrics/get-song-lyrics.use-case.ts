import { z } from 'zod'
import { Endpoints } from '#common/constants'
import { useFetch } from '#common/helpers'
import { ApiContextEnum } from '#common/enums'
import type { IUseCase } from '#common/types'

export interface GetSongLyricsArgs {
  lyricsId: string
}

const LyricsResponseSchema = z.object({
  lyrics: z.string(),
  snippet: z.string().optional(),
  copyright: z.string().optional()
})

export type LyricsResponse = z.infer<typeof LyricsResponseSchema>

export class GetSongLyricsUseCase implements IUseCase<GetSongLyricsArgs, LyricsResponse | null> {
  constructor() {}

  execute = async (args: GetSongLyricsArgs): Promise<LyricsResponse | null> => {
    const { lyricsId } = args

    if (!lyricsId) {
      return null
    }

    try {
      const { data } = await useFetch<{ lyrics: string; snippet?: string; copyright?: string }>({
        endpoint: Endpoints.songs.lyrics,
        params: { 
          lyrics_id: lyricsId
        },
        context: ApiContextEnum.WEB6DOT0
      })

      if (!data?.lyrics) {
        return null
      }

      return {
        lyrics: data.lyrics,
        snippet: data.snippet,
        copyright: data.copyright
      }
    } catch (error) {
      console.error('Error fetching lyrics:', error)
      return null
    }
  }
}
