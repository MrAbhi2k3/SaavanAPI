export const Endpoints = {
  home: {
    launchData: 'webapi.getLaunchData',
    topSearches: 'content.getTopSearches'
  },
  search: {
    all: 'autocomplete.get',
    songs: 'search.getResults',
    albums: 'search.getAlbumResults',
    artists: 'search.getArtistResults',
    playlists: 'search.getPlaylistResults'
  },
  radio: {
    featured: 'webradio.createFeaturedStation',
    artist: 'webradio.createArtistStation',
    entity: 'webradio.createEntityStation',
    songs: 'webradio.getSong'
  },
  recommendations: {
    songs: 'reco.getreco',
    albums: 'reco.getAlbumReco',
    artistOtherTopSongs: 'search.artistOtherTopSongs'
  },
  songs: {
    id: 'song.getDetails',
    link: 'webapi.get',
    suggestions: 'webradio.getSong',
    lyrics: 'lyrics.getLyrics',
    station: 'webradio.createEntityStation'
  },
  albums: {
    id: 'content.getAlbumDetails',
    link: 'webapi.get'
  },
  artists: {
    id: 'artist.getArtistPageDetails',
    link: 'webapi.get',
    songs: 'artist.getArtistMoreSong',
    albums: 'artist.getArtistMoreAlbum'
  },
  playlists: {
    id: 'playlist.getDetails',
    link: 'webapi.get'
  },
  modules: 'content.getBrowseModules',
  trending: 'content.getTrending'
}
