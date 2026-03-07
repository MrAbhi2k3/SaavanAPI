import { Endpoints } from '#common/constants'
import { ApiContextEnum } from '#common/enums'
import { useFetch } from '#common/helpers'
import { createSongPayload } from '#modules/songs/helpers'
import type { SongAPIResponseModel, SongModel, SongSuggestionAPIResponseModel } from '#modules/songs/models'
import type { z } from 'zod'

export class DiscoveryService {
  async getHomeData() {
    const { data } = await useFetch<Record<string, unknown>>({
      endpoint: Endpoints.home.launchData,
      params: {}
    })

    return data
  }

  async getTopSearches() {
    const { data } = await useFetch<unknown[]>({
      endpoint: Endpoints.home.topSearches,
      params: {}
    })

    return Array.isArray(data) ? data : []
  }

  async createFeaturedRadioStation(name: string) {
    const { data } = await useFetch<{ stationid?: string }>({
      endpoint: Endpoints.radio.featured,
      params: { name },
      context: ApiContextEnum.ANDROID
    })

    return data.stationid || null
  }

  async createArtistRadioStation(name: string, query: string) {
    const { data } = await useFetch<{ stationid?: string }>({
      endpoint: Endpoints.radio.artist,
      params: { name, query },
      context: ApiContextEnum.ANDROID
    })

    return data.stationid || null
  }

  async createEntityRadioStation(entityId: string, entityType: string) {
    const encodedEntityId = entityType === 'queue' ? JSON.stringify([encodeURIComponent(entityId)]) : entityId

    const { data } = await useFetch<{ stationid?: string } | unknown[]>({
      endpoint: Endpoints.radio.entity,
      params: {
        entity_id: encodedEntityId,
        entity_type: entityType
      },
      context: ApiContextEnum.ANDROID
    })

    if (Array.isArray(data)) {
      return null
    }

    return data.stationid || null
  }

  async getRadioSongs(stationId: string, limit: number): Promise<z.infer<typeof SongModel>[]> {
    const { data } = await useFetch<z.infer<typeof SongSuggestionAPIResponseModel> | { error?: string }>({
      endpoint: Endpoints.radio.songs,
      params: {
        stationid: stationId,
        k: limit
      },
      context: ApiContextEnum.ANDROID
    })

    if ('error' in data && data.error) {
      return []
    }

    const suggestions = Object.values(data)
      .filter((item): item is { song: z.infer<typeof SongAPIResponseModel> } => {
        return typeof item === 'object' && item !== null && 'song' in item
      })
      .map((item) => createSongPayload(item.song))
      .slice(0, limit)

    return suggestions
  }

  async getSongRecommendations(songId: string): Promise<z.infer<typeof SongModel>[]> {
    const { data } = await useFetch<Record<string, z.infer<typeof SongAPIResponseModel>[]> | unknown[]>({
      endpoint: Endpoints.recommendations.songs,
      params: { pid: songId },
      context: ApiContextEnum.ANDROID
    })

    if (Array.isArray(data)) {
      return []
    }

    const candidates = Array.isArray(data[songId]) ? data[songId] : Object.values(data).flat()

    return candidates.map((song) => createSongPayload(song))
  }

  async getAlbumRecommendations(albumId: string) {
    const { data } = await useFetch<unknown[]>({
      endpoint: Endpoints.recommendations.albums,
      params: { albumid: albumId },
      context: ApiContextEnum.ANDROID
    })

    return Array.isArray(data) ? data : []
  }

  async getArtistOtherTopSongs(artistIds: string, songId: string): Promise<z.infer<typeof SongModel>[]> {
    const { data } = await useFetch<z.infer<typeof SongAPIResponseModel>[]>({
      endpoint: Endpoints.recommendations.artistOtherTopSongs,
      params: {
        artist_ids: artistIds,
        song_id: songId
      },
      context: ApiContextEnum.ANDROID
    })

    if (!Array.isArray(data)) {
      return []
    }

    return data.map((song) => createSongPayload(song))
  }
}
