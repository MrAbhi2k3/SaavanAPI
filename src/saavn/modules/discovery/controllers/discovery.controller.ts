import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { SongModel } from '#modules/songs/models'
import { DiscoveryService } from '#modules/discovery/services'
import type { Routes } from '#common/types'

export class DiscoveryController implements Routes {
  public controller: OpenAPIHono
  private discoveryService: DiscoveryService

  constructor() {
    this.controller = new OpenAPIHono()
    this.discoveryService = new DiscoveryService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/home',
        tags: ['Discovery'],
        summary: 'Get home launch data',
        description: 'Fetch launch data from JioSaavn home APIs.',
        operationId: 'getHomeData',
        responses: {
          200: {
            description: 'Successful response with home launch data',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.any()
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const response = await this.discoveryService.getHomeData()

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/top-searches',
        tags: ['Discovery'],
        summary: 'Get top searches',
        description: 'Fetch currently trending top searches from JioSaavn.',
        operationId: 'getTopSearches',
        responses: {
          200: {
            description: 'Successful response with top searches',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(z.any())
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const response = await this.discoveryService.getTopSearches()

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/featured',
        tags: ['Radio'],
        summary: 'Create featured radio station',
        description: 'Create a featured station using station name and return station id.',
        operationId: 'createFeaturedRadio',
        request: {
          query: z.object({
            name: z.string().openapi({
              description: 'Featured station name',
              example: 'hindi'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with station id',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.object({
                    stationId: z.string().nullable()
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const { name } = ctx.req.valid('query')
        const stationId = await this.discoveryService.createFeaturedRadioStation(name)

        return ctx.json({ success: true, data: { stationId } })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/artist',
        tags: ['Radio'],
        summary: 'Create artist radio station',
        description: 'Create an artist station and return station id.',
        operationId: 'createArtistRadio',
        request: {
          query: z.object({
            name: z.string().openapi({
              description: 'Artist display name',
              example: 'arijit singh'
            }),
            query: z.string().optional().openapi({
              description: 'Artist search query used by JioSaavn API',
              example: 'arijit singh'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with station id',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.object({
                    stationId: z.string().nullable()
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const { name, query } = ctx.req.valid('query')
        const stationId = await this.discoveryService.createArtistRadioStation(name, query || name)

        return ctx.json({ success: true, data: { stationId } })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/entity',
        tags: ['Radio'],
        summary: 'Create entity radio station',
        description: 'Create a radio station from an entity id (song/album/artist/queue).',
        operationId: 'createEntityRadio',
        request: {
          query: z.object({
            entityId: z.string().openapi({
              description: 'Entity identifier',
              example: '3IoDK8qI'
            }),
            entityType: z.string().optional().openapi({
              description: 'Entity type. Use queue for song-based station creation.',
              example: 'queue',
              default: 'queue'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with station id',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.object({
                    stationId: z.string().nullable()
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const { entityId, entityType } = ctx.req.valid('query')
        const stationId = await this.discoveryService.createEntityRadioStation(entityId, entityType || 'queue')

        return ctx.json({ success: true, data: { stationId } })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/radio/{stationId}/songs',
        tags: ['Radio'],
        summary: 'Get songs for a radio station',
        description: 'Fetch songs for a station id.',
        operationId: 'getRadioSongs',
        request: {
          params: z.object({
            stationId: z.string().openapi({
              description: 'Radio station id'
            })
          }),
          query: z.object({
            limit: z.string().pipe(z.coerce.number()).optional().openapi({
              description: 'Number of songs to return',
              example: '10',
              default: '10'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with radio songs',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(SongModel)
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const stationId = ctx.req.param('stationId')
        const { limit } = ctx.req.valid('query')

        const response = await this.discoveryService.getRadioSongs(stationId, limit || 10)

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/recommendations/songs/{songId}',
        tags: ['Recommendations'],
        summary: 'Get song recommendations',
        description: 'Get recommended songs from a song id.',
        operationId: 'getSongRecommendations',
        request: {
          params: z.object({
            songId: z.string().openapi({
              description: 'Song id used as recommendation seed',
              example: '3IoDK8qI'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song recommendations',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(SongModel)
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('songId')
        const response = await this.discoveryService.getSongRecommendations(songId)

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/recommendations/albums/{albumId}',
        tags: ['Recommendations'],
        summary: 'Get album recommendations',
        description: 'Get recommended albums from an album id.',
        operationId: 'getAlbumRecommendations',
        request: {
          params: z.object({
            albumId: z.string().openapi({
              description: 'Album id used as recommendation seed',
              example: '23241654'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with album recommendations',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(z.any())
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const albumId = ctx.req.param('albumId')
        const response = await this.discoveryService.getAlbumRecommendations(albumId)

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/recommendations/artists/top-songs',
        tags: ['Recommendations'],
        summary: 'Get artist other top songs',
        description: 'Get additional top songs for artist ids in a song context.',
        operationId: 'getArtistOtherTopSongs',
        request: {
          query: z.object({
            artistIds: z.string().openapi({
              description: 'Comma-separated artist ids',
              example: '1274170'
            }),
            songId: z.string().openapi({
              description: 'Current song id',
              example: '3IoDK8qI'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with songs',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(SongModel)
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const { artistIds, songId } = ctx.req.valid('query')
        const response = await this.discoveryService.getArtistOtherTopSongs(artistIds, songId)

        return ctx.json({ success: true, data: response })
      }
    )
  }
}
