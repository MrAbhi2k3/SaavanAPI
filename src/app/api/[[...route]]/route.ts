import { App } from '@/saavn/app'
import { AlbumController, ArtistController, SearchController, SongController } from '@/saavn/modules'
import { PlaylistController } from '@/saavn/modules/playlists/controllers'

export const runtime = 'nodejs'

const app = new App([
  new SearchController(),
  new SongController(),
  new AlbumController(),
  new ArtistController(),
  new PlaylistController()
]).getApp()

const handler = (req: Request) => app.fetch(req)

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const OPTIONS = handler
export const HEAD = handler
