const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicDataHandler
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAllMusicDataHandler
  }
]

module.exports = routes
