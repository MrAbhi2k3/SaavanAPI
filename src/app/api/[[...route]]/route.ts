import { App } from '@/saavn/app'
import { AlbumController, ArtistController, DiscoveryController, SearchController, SongController } from '@/saavn/modules'
import { PlaylistController } from '@/saavn/modules/playlists/controllers'

export const runtime = 'nodejs'
export const maxDuration = 60

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController(),
  new DiscoveryController()
]).getApp()

const handler = async (req: Request) => {
  try {
    return await app.fetch(req)
  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const OPTIONS = handler
export const HEAD = handler
