import {
  CreateSongStationUseCase,
  GetSongByIdUseCase,
  GetSongByLinkUseCase,
  GetSongSuggestionsUseCase,
  GetSongLyricsUseCase,
  type GetSongByIdArgs,
  type GetSongSuggestionsArgs,
  type GetSongLyricsArgs
} from '#modules/songs/use-cases'

export class SongService {
  private readonly getSongByIdUseCase: GetSongByIdUseCase
  private readonly getSongByLinkUseCase: GetSongByLinkUseCase
  private readonly createSongStationUseCase: CreateSongStationUseCase
  private readonly getSongSuggestionsUseCase: GetSongSuggestionsUseCase
  private readonly getSongLyricsUseCase: GetSongLyricsUseCase

  constructor() {
    this.getSongByIdUseCase = new GetSongByIdUseCase()
    this.getSongByLinkUseCase = new GetSongByLinkUseCase()
    this.createSongStationUseCase = new CreateSongStationUseCase()
    this.getSongSuggestionsUseCase = new GetSongSuggestionsUseCase()
    this.getSongLyricsUseCase = new GetSongLyricsUseCase()
  }

  getSongByIds = (args: GetSongByIdArgs) => {
    return this.getSongByIdUseCase.execute(args)
  }

  getSongByLink = (token: string) => {
    return this.getSongByLinkUseCase.execute(token)
  }

  createSongStation = (songIds: string) => {
    return this.createSongStationUseCase.execute(songIds)
  }

  getSongSuggestions = (args: GetSongSuggestionsArgs) => {
    return this.getSongSuggestionsUseCase.execute(args)
  }

  getSongLyrics = (args: GetSongLyricsArgs) => {
    return this.getSongLyricsUseCase.execute(args)
  }
}
