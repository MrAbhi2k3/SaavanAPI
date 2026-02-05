import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { SongModel } from '#modules/songs/models'
import { SongService } from '#modules/songs/services'
import { z } from 'zod'
import type { Routes } from '#common/types'
import type { hc } from 'hono/client'

export class SongController implements Routes {
  public controller: OpenAPIHono
  public static songClient: typeof hc
  private songService: SongService

  constructor() {
    this.controller = new OpenAPIHono()
    this.songService = new SongService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs',
        tags: ['Songs'],
        summary: 'Retrieve songs by ID or link',
        description: 'Retrieve songs by a comma-separated list of IDs or by a direct link to the song on JioSaavn.',
        operationId: 'getSongByIdsOrLink',
        request: {
          query: z.object({
            ids: z.string().optional().openapi({
              title: 'Song IDs',
              description: 'Comma-separated list of song IDs',
              type: 'string',
              example: 'rh1gIwY_'
            }),
            link: z
              .string()
              .url()
              .optional()
              .transform((value) => value?.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1])
              .openapi({
                title: 'Song Link',
                description: 'A direct link to the song on JioSaavn',
                type: 'string',
                example: 'https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM'
              })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    title: 'Song Details',
                    description: 'Array of song details'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when query parameters are missing or invalid' },
          404: { description: 'Song not found with the given ID or link' }
        }
      }),
      async (ctx) => {
        const { link, ids } = ctx.req.valid('query')

        if (!link && !ids) {
          return ctx.json({ success: false, message: 'Either song IDs or link is required' }, 400)
        }

        const response = link
          ? await this.songService.getSongByLink(link)
          : await this.songService.getSongByIds({ songIds: ids! })

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/{id}',
        tags: ['Songs'],
        summary: 'Retrieve song by ID',
        description: 'Retrieve a song by its ID. Optionally, include lyrics in the response.',
        operationId: 'getSongById',
        request: {
          params: z.object({
            id: z.string().openapi({
              title: 'Song ID',
              description: 'ID of the song to retrieve',
              type: 'string',
              example: 'rh1gIwY_'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song details',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    description: 'Array of songs'
                  })
                })
              }
            }
          },
          400: { description: 'Bad request when query parameters are missing or invalid' },
          404: { description: 'Song not found for the given ID' }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('id')

        const response = await this.songService.getSongByIds({ songIds: songId })

        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/{id}/suggestions',
        tags: ['Songs'],
        summary: 'Retrieve song suggestions',
        description:
          'Retrieve song suggestions based on the given song ID. This can be used to get similar songs to the one provided for infinite playback.',
        operationId: 'getSongSuggestions',
        request: {
          params: z.object({
            id: z.string().openapi({
              description: 'ID of the song to retrieve suggestions for',
              type: 'string',
              example: 'yDeAS8Eh'
            })
          }),
          query: z.object({
            limit: z.string().pipe(z.coerce.number()).optional().openapi({
              description: 'Limit the number of suggestions to retrieve',
              type: 'number',
              title: 'Limit',
              example: '10',
              default: '10'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song suggestions',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(SongModel).openapi({
                    description: 'Array of song suggestions'
                  })
                })
              }
            }
          }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('id')
        const { limit } = ctx.req.valid('query')

        const suggestions = await this.songService.getSongSuggestions({ songId, limit: limit || 10 })

        return ctx.json({ success: true, data: suggestions })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/songs/{id}/lyrics',
        tags: ['Songs'],
        summary: 'Retrieve song lyrics',
        description: 'Retrieve lyrics for a song by its ID. The song must have lyrics available.',
        operationId: 'getSongLyrics',
        request: {
          params: z.object({
            id: z.string().openapi({
              description: 'ID of the song to retrieve lyrics for',
              type: 'string',
              example: 'rh1gIwY_'
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with song lyrics',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.object({
                    lyrics: z.string().openapi({
                      description: 'Full lyrics of the song',
                      example: 'Verse 1:\nLyrics text here...\n\nChorus:\nMore lyrics...'
                    }),
                    snippet: z.string().optional().openapi({
                      description: 'Short snippet of the lyrics'
                    }),
                    copyright: z.string().optional().openapi({
                      description: 'Copyright information for the lyrics'
                    })
                  }).nullable().openapi({
                    description: 'Lyrics data or null if not available'
                  })
                })
              }
            }
          },
          404: { description: 'Lyrics not found or not available for this song' }
        }
      }),
      async (ctx) => {
        const songId = ctx.req.param('id')

        // First, get song details to check if it has lyrics
        let songData
        try {
          songData = await this.songService.getSongByIds({ songIds: songId })
        } catch (error) {
          return ctx.json({ 
            success: false, 
            message: 'Song not found'
          }, 404)
        }

        if (!songData || songData.length === 0) {
          return ctx.json({ 
            success: false, 
            message: 'Song not found'
          }, 404)
        }

        const song = songData[0]

        // Check if the song actually has lyrics
        if (!song.hasLyrics) {
          return ctx.json({ 
            success: false, 
            message: 'This song does not have lyrics available',
            data: {
              songId: song.id,
              songName: song.name,
              hasLyrics: false,
              lyricsId: song.lyricsId
            }
          }, 404)
        }

        // Now fetch the lyrics using the lyricsId or songId
        const lyricsId = song.lyricsId || song.id
        const lyrics = await this.songService.getSongLyrics({ lyricsId })

        if (!lyrics) {
          return ctx.json({ 
            success: false, 
            message: 'Failed to fetch lyrics for this song',
            data: {
              songId: song.id,
              songName: song.name,
              hasLyrics: song.hasLyrics,
              lyricsId: song.lyricsId,
              triedWith: lyricsId
            }
          }, 404)
        }

        return ctx.json({ 
          success: true, 
          data: {
            ...lyrics,
            songInfo: {
              id: song.id,
              name: song.name,
              lyricsId: song.lyricsId
            }
          }
        })
      }
    )
  }
}
