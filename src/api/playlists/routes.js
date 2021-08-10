const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.addSongsToPlaylistHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  },
  // {
  //   method: 'PUT',
  //   path: '/playlists/{id}',
  //   handler: handler.putPlaylistByIdHandler,
  //   options: {
  //     auth: 'openmusic_jwt'
  //   }
  // },
  // {
  //   method: 'DELETE',
  //   path: '/playlists/{id}',
  //   handler: handler.deletePlaylistByIdHandler,
  //   options: {
  //     auth: 'openmusic_jwt'
  //   }
  // },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler
  }
]

module.exports = routes
